// Prerequisites:  applib, chosen, ko.postbox

var qa_ans = [];

(function ($) {

    var userstates = null; //The current state of qas that pertain to me.
    var outlines = []; //Form outlines that are relevant to me (where I have an active user state OR permission to invoke)

    $.fn.qa = function (o) {

        var me = this;

        if (o.action == "loginInit") {
            //window.qa_3();
            //return false;
            a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "qa", cmd: "getQaUserStates", role: $.cookie("TP1Role") /* TODO: I don't like passing the role here */ },
                dataType: "json", cache: false, error: a$.ajaxerror, success: loadedInit
            });
            function loadedInit(json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    userstates = json.qaUserStates;
                    //Look for startups, then send a request to retrieve all of them.
                    var startupformids = [];
                    for (var i in userstates) {
                        if (userstates[i].assignment.type == "login") {
                            if (userstates[i].assignment.delivery.notification == "contextual") {
                            		var uc = userstates[i].assignment.delivery.contexts;
                                for (var c in userstates[i].assignment.delivery.contexts) {
                                    if (passesFilterCritera(uc[c].filters)) {
                                        if (uc[c].startup == "popup") {
                                            startupformids.push(userstates[i].formId); //So we can retrieve the outlines momentarily.
                                        }
                                        else if ((uc[c].startup == "link") || (uc[c].startup == "easycom")) {
                                            //Install the linking mechanism (probably some html that initiates the form).
                                            var h = uc[c].html;
                                            if (a$.exists(uc[c].appendSelector)) {
                                                var sel;
                                                if (uc[c].startup == "link") {
	                                                $(uc[c].appendSelector).append(h);
                                                	sel = $(uc[c].appendSelector).children().last();
                                                }
                                                else if (uc[c].startup == "easycom") {
                                                	$(uc[c].appendSelector).addClass("ec-message-override");
                                                	sel = $(" .ec-message",uc[c].appendSelector);
                                                	$(sel).html(h);
                                                	//Turn it on and animate it (in case there's no fallback easycom message).
                                                	if (uc[c].appendSelector == ".ec-loc-notification") {
													                        	$(uc[c].appendSelector).css("color", "white").show();
                        														$(uc[c].appendSelector).css("right", "0px").css("bottom", "-300px").animate({
                            														right: "0px",
                            														bottom: "0px"
                        															}, 2500, function () { }
                        														);
                        													}
                                                }
                                                $(sel).unbind().bind("click", function () {
                                                		if (uc[c].startup == "easycom") {
                                                			$(uc[c].appendSelector).hide();
                                                		}
                                                    uc[c].myselector = this;
                                                    var myformids = [];
                                                    myformids.push(userstates[i].formId);
                                                    a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "qa", cmd: "getQaOutlines", formids: myformids },
                                                        dataType: "json", cache: false, error: a$.ajaxerror, success: loadedOutline
                                                    });
                                                    function loadedOutline(json) {
                                                        if (a$.jsonerror(json)) {
                                                        }
                                                        else {
                                                            //DONE: extend the outlines array to include these forms (in case they're already here).
                                                            addoutlines(json.qaOutlines);
                                                            //TODO: Blast in the html and javascript from the form (not sure how)
                                                            //DONE: Launch the javascript
                                                            //$(userstates[i].assignment.delivery.contexts[c].myselector).hide(); - Decided to leave bubbles and handle dismissal at the end.
                                                            //Make any last-minute filter-based changes

                                                            //TODO: Add all client-specific conditions to the form (first example is: are we playing the game?)
                                                            //NOTE: Many conditions are handled server-side.  Game is handled client-side because it affects the form itself and the actions.
                                                            //     The alternative would be to make a game and non-game version, which may be the better choice :)

                                                            for (var f in outlines) {
                                                                if (outlines[f].formId == userstates[i].formId) {
                                                                    if (a$.exists(outlines[f].assessment.game)) {
                                                                        if (a$.exists(outlines[f].assessment.game.filters)) {
                                                                            if (passesFilterCritera(outlines[f].assessment.game.filters)) {
                                                                                outlines[f].assessment.game.playing = "Y";
                                                                            }
                                                                        }
                                                                        else {
                                                                            outlines[f].assessment.game.playing = "Y";
                                                                        }
                                                                        if (!a$.exists(outlines[f].assessment.game.playing)) {
                                                                            $(".qa-game-" + userstates[i].formId).hide();
                                                                        }
                                                                    }
                                                                    break;
                                                                }
                                                            }
                                                            eval("window.qa_" + userstates[i].formId + "()");
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (startupformids.length) {
                        a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "qa", cmd: "getQaOutlines", formids: startupformids },
                            dataType: "json", cache: false, error: a$.ajaxerror, success: loadedStartupOutlines
                        });
                        function loadedStartupOutlines(json) {
                            //DONE: extend the outlines array to include these forms (in case they're already here).
                            addoutlines(json.qaOutlines);
                            //TODO: Make decisions on which question to ask. AND WHICH FORM TO LOAD (can only load 1, probably).
                            var formtoload = 1;
                            //DEBUG: This is a shortcut and assumes it's suppost to pop up. DUCK
                            if (json.qaOutlines.length == 1) {
                                formtoload = json.qaOutlines[0].formId;
                            }
                            //TODO: Blast in the jquery and html members, then go to the correct question.
                            //QUESTION: Is it possible to install questions jquery/html separately?  If not, I could be blasting 1000 questions at some point.
                            //This issue is mitigated by breaking long subscriptions into shorter forms.
                            //setTimeout("window.qa_" + formtoload, 0);
                            //window.qa_1();
                            eval("window.qa_" + formtoload + "()");
                        }
                    }
                    //ko.postbox.publish("TODO:", myvar);
                }
            }
        }
        else if (o.action == "setQuestion") {
            $(".qa-w-" + o.data.f + " .qa-question").hide();
            $(".qa-q-" + o.data.f + "-" + o.data.q).show();
        }
        else if (o.action == "styleListHover") {
            //Usage: data: { f: 1, q: 100, hover: { color: "black", backgroundColor: "#d0d0d0" }, selected: { color: "white", backgroundColor: "black"} };
            $(".qa-q-" + o.data.f + "-" + o.data.q + " li").unbind().bind("mouseover", function () {
                var myindex = $(this).index();
                if (qa_ans[o.data.f + "_" + o.data.q].index != $(this).index()) {
                    if (a$.exists(o.data.hover)) {
                        $(this).css("background-color", a$.exists(o.data.hover.backgroundColor) ? o.data.hover.backgroundColor : "#d0d0d0");
                        $(this).css("color", a$.exists(o.data.hover.color) ? o.data.hover.color : "");
                    }
                    else {
                        $(this).css("background-color", "#d0d0d0").css("color", "");
                    }
                }
            }).bind("mouseout", function () {
                if (qa_ans[o.data.f + "_" + o.data.q].index != $(this).index()) {
                    $(this).css("background-color", "").css("color", "");
                }
            }).bind("click", function () {
                qa_ans[o.data.f + "_" + o.data.q].index = $(this).index();
                $(".qa-q-" + o.data.f + "-" + o.data.q + " li").each(function () {
                    $(this).css("background-color", "").css("color", "");
                });
                if (a$.exists(o.data.selected)) {
                    $(this).css("background-color", a$.exists(o.data.selected.backgroundColor) ? o.data.selected.backgroundColor : "#eee");
                }
                else {
                    $(this).css("background-color", "#eee");
                }
                $(".qa-s-" + o.data.f + "-" + o.data.q).prop("disabled", false).removeClass("qa-submit-disabled");
            });
        }
        else if (o.action == "save") {
            //TODO:  Will work differently when monitors functionality is added
            var examinee = a$.exists(o.data.examinee) ? o.data.examinee.uid : $.cookie("TP1Username");
            var examiner = a$.exists(o.data.examiner) ? o.data.examiner.uid : "";
            //alert("debug: saving form " + o.data.f + ", examinee=" + examinee);
            for (var f in outlines) {
                if (outlines[f].formId == o.data.f) {
                    var foundanswers = false;
                    var answers = [];
                    for (var s in outlines[f].sections) {
                        for (var q in outlines[f].sections[s].questions) {
                            var answered = false;
                            var score = 0.0;
                            var answertext="";
                            //TODO: For partial tests, be sure not to record answers from questions that weren't asked today.
                            //(will need to cross reference with the structure you make for whatever is chosen).
                            switch (outlines[f].sections[s].questions[q].ui.control) {
                                case "bulletlist":
                                case "orderedlist":
                                    if (a$.exists(qa_ans[outlines[f].formId + "_" + outlines[f].sections[s].questions[q].id])) {
                                        if (qa_ans[outlines[f].formId + "_" + outlines[f].sections[s].questions[q].id].index >= 0)
                                        {
                                            if (outlines[f].sections[s].questions[q].value > 0) {
                                                score = outlines[f].sections[s].questions[q].answers[qa_ans[outlines[f].formId + "_" + outlines[f].sections[s].questions[q].id].index].score;
                                            }
                                            answertext = $(".qa-q-" + outlines[f].formId + "-" + outlines[f].sections[s].questions[q].id + " li").eq(qa_ans[outlines[f].formId + "_" + outlines[f].sections[s].questions[q].id].index).html();
                                            answered = true;
                                        }
                                    }
                                    break;
                                case "textarea":
                                    answertext = $(".qa-a-" + outlines[f].formId + "-" + outlines[f].sections[s].questions[q].id).val();
                                    answered = true
                                    break;
                                case "slider":
                                    if (outlines[f].sections[s].questions[q].ui.type == "number") {
                                        answertext = $(".qa-a-" + outlines[f].formId + "-" + outlines[f].sections[s].questions[q].id).val()
                                        answered = true;
                                    }
                                    else {
                                        alert("Non-numeric sliders not yet supported");
                                    }
                                    break;
                            }
                            if (answered) {
                                foundanswers = true;
                                answers.push({ idquestion: outlines[f].sections[s].questions[q].id, version: outlines[f].sections[s].questions[q].version, score: score, answertext: answertext });
                                //alert("debug: answer to question # " + outlines[f].sections[s].questions[q].id + ", answer = " + answer + ", answertext = " + answertext);
                            }
                            //TODO: Collect the answers, then submit them to be saved.
                            //TODO: Handle the gamification component.
                        }
                    }
                    if (foundanswers) {
                        for (var u in userstates) {
                            //TODO: This will delete all bubbles of the same form id.  This is ok usually, are there instances where this is bad?  If so, build in flags accordingly.
                            if (userstates[u].formId == o.data.f) {
                                if (a$.exists(userstates[u].assignment)) {
                                    if (a$.exists(userstates[u].assignment.delivery)) {
                                        if (a$.exists(userstates[u].assignment.delivery.contexts)) {
                                            for (var c in userstates[u].assignment.delivery.contexts) {
                                                if (a$.exists(userstates[u].assignment.delivery.contexts[c].myselector)) {
                                                    $(userstates[u].assignment.delivery.contexts[c].myselector).hide();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        a$.ajax({ type: "GET", service: "JScript", async: true,
                            data: { lib: "qa", cmd: "saveQaForm", formId: o.data.f, allowMultiple: outlines[f].assessment.allowMultiple, examiner: examiner, examinee: examinee, answers: answers },
                            dataType: "json", cache: false, error: a$.ajaxerror, success: savedQaForm
                        });
                        function savedQaForm(json) {
                            if (a$.jsonerror(json)) {
                            }
                            else {
                                if (a$.exists(json.qamsg)) {
                                    alert(json.qamsg); //TODO: Why is it dumping the entire opbject here?
                                }
                                else { //Assuming no errors.  The game thing isn't very general, will need some more examples.
                                    if (a$.exists(outlines[f].assessment.game)) {
                                        if (a$.exists(outlines[f].assessment.game.playing)) {
                                            if (outlines[f].assessment.game.playing=="Y") {
                                                if (outlines[f].assessment.game.system == "rankpoints") {
                                                    if (outlines[f].assessment.game.specs.unit=="form") {
                                                        var foundrule = false;
                                                        var value = 0;
                                                        var paytype = "";
                                                        var reason = "";
                                                        for (var r in outlines[f].assessment.game.specs.rules) {
                                                            if (outlines[f].assessment.game.specs.rules[r].condition == "completion") {
                                                                foundrule = true;
                                                                value = outlines[f].assessment.game.specs.rules[r].value;
                                                                paytype = outlines[f].assessment.game.specs.rules[r].paytype;
                                                                reason = outlines[f].assessment.game.specs.rules[r].reason;
                                                            }
                                                        }
                                                        a$.ajax({ type: "GET", service: "JScript", async: true,
                                                            data: { lib: "qa", cmd: "saveGame", examiner: examiner, examinee: examinee, value: value, paytype: paytype, reason: reason },
                                                            dataType: "json", cache: false, error: a$.ajaxerror, success: savedGame
                                                        });
                                                        function savedGame(json) {
                                                            if (a$.jsonerror(json)) {
                                                            }
                                                            else {
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break; //The form was found, exit the loop
                }
            }
            //DONE: Get the form outline client-side, then with this + o.data.f, examiner, and examinee - you should be able to save the QA.
        }

        function addoutlines(newoutlines) {
            for (var j in newoutlines) {
                var found = false;
                for (var k in outlines) {
                    if (outlines[k].formId == newoutlines[j].formId) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    outlines.push(newoutlines[j]);
                }
            }
        }

        function passesFilterCritera(filters) {
            var pass = true;
            if (a$.exists(filters)) {
                if (a$.exists(filters.clients)) {
                    pass = false;
                    for (var i in filters.clients) {
                        if (a$.exists(filters.clients[i].prefixes)) {
                            for (var p in filters.clients[i].prefixes) {
                                if (filters.clients[i].prefixes[p] == a$.urlprefix()) {
                                    pass = true;
                                    break;
                                }
                            }
                            if (pass) break;
                        }
                    }
                }
            }
            return pass;
        }

    };
} (jQuery));
