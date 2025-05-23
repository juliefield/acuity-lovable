// Prerequisites:  applib, chosen, ko.postbox

var qa_ans = [];

(function ($) {

    var userstates = null; //The current state of qas that pertain to me.
    var outlines = []; //Form outlines that are relevant to me (where I have an active user state OR permission to invoke)

    $.fn.qa = function (o) {

        var me = this;

        return;

        if (o.action == "loginInit") {
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
                                if (userstates[i].assignment.delivery.context.startup == "popup") {
                                    startupformids.push(userstates[i].formId); //So we can retrieve the outlines momentarily.
                                }
                                else if (userstates[i].assignment.delivery.context.startup == "link") {
                                    //Install the linking mechanism (probably some html that initiates the form).
                                    var h = userstates[i].assignment.delivery.context.html;
                                    if (a$.exists(userstates[i].assignment.delivery.context.appendSelector)) {
                                        $(userstates[i].assignment.delivery.context.appendSelector).append(h);
                                        $(userstates[i].assignment.delivery.context.appendSelector).children().last().unbind().bind("click", function () {
                                            var meprompt = this;
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
                                                    //setTimeout("window.qa_" + userstates[i].formId, 0);
                                                    //qa_2();
                                                    $(meprompt).hide();
                                                    eval("window.qa_" + userstates[i].formId + "()");
                                                }
                                            }
                                        });
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
                                        if (outlines[f].sections[s].questions[q].value > 0) {
                                            score = outlines[f].sections[s].questions[q].answers[qa_ans[outlines[f].formId + "_" + outlines[f].sections[s].questions[q].id].index].score;
                                        }
                                        answertext = $(".qa-q-" + outlines[f].formId + "-" + outlines[f].sections[s].questions[q].id + " li").eq(qa_ans[outlines[f].formId + "_" + outlines[f].sections[s].questions[q].id].index).html();
                                        answered = true;
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
                                answers.push({ idquestion: outlines[f].sections[s].questions[q].id, score: score, answertext: answertext });
                                //alert("debug: answer to question # " + outlines[f].sections[s].questions[q].id + ", answer = " + answer + ", answertext = " + answertext);
                            }
                            //TODO: Collect the answers, then submit them to be saved.
                            //TODO: Handle the gamification component.
                        }
                    }
                    if (foundanswers) {
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
    };
} (jQuery));
