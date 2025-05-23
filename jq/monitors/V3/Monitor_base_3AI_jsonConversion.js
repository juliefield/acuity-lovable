
function exists(me) {
    return (typeof me != 'undefined');
}

function spacefree(c) {
    if (c) {
        return c.toString().replace(" ", "");
    }
    else {
        return "spacefreeError";
    }
}
function simpleblock(c, s, lbl) {
    var bld = "";
    bld += '<div class="autoqa-' + c + '">';
    bld += '<label>' + lbl + ':</label>';
    bld += '<span>' + s + '</span>';
    bld += '</div>';
    return bld;
}

function jsonConversion(json,jsontrans,mons,aiprev,proposed) {

    var bld = "";
    var tmp;

    var sqfcode = $("#lblSqfcode").html();
    var prefix = a$.urlprefix();

    bld = '<div class="autoqa-wrapper2">';
    bld += '<div class="autoqa-wrapper">';

    var mymonitorid = $("#lblMonitorId").html();

    tmp = "";
    if (typeof json.OverallScore === 'object') {
        tmp += "" + json.OverallScore.Numerator + "/" + json.OverallScore.Denominator + " (" + json.OverallScore.Percentage + "%)";
    }
    else {
        tmp += json.OverallScore;
    }

    if (!proposed) {
        bld += simpleblock('overallscore', tmp, 'Overall Score');
    }
    else {
        var myscore;
        if (aiprev == 0) {
            myscore = "" + parseFloat($(".ac-score").html()).toFixed(2);
        }
        else {
            if ($("#lblAI_PCT_SCORE").html() != "") {
                myscore = "" + parseFloat($("#lblAI_PCT_SCORE").html()).toFixed(2) + " %";
            }
            else {
                myscore = "N/A";
            }
        }
        /*
        if (aiprev == 0) { //Only display the overall score if this is the most current generation (where qa_resp is populated)
            bld += '<div class="autoqa-overallscore">';
            //bld += $(".ac-overall-score").text().replace(/qst=/g, "notqst=").replace(/AUTOFAIL/g, "");
            bld += "Overall Score: " + parseFloat($(".ac-score").html()).toFixed(2) + " %";
            bld += "</div>";
        }
        else {
            if ($("#lblAI_PCT_SCORE").html() != "") {
                bld += '<div class="autoqa-overallscore">';
                bld += "Overall Score: " + parseFloat($("#lblAI_PCT_SCORE").html()).toFixed(2) + " %";
                bld += "</div>";                
            }
        }
        */

        bld += '<table class="autoqa-table-score"><thead><tr><th class="autoqa-column-scorelabel"></th><th class="autoqa-column-score-ai">This Monitor<br />(AI Scored)</th>';
        for (var m in mons) {
            if (mons[m].monitor_id != mymonitorid) {
                bld += '<th class="autoqa-column-score-manual" title="Overall Score: ' + mons[m].pct_score.toFixed(2) + '%' + '">Monitor ' + '<a href="https://' + a$.urlprefix(true) + 'acuityapm.com/monitor/monitor_review.aspx?origin=report&prefix=da&id=' + mons[m].monitor_id + '" target="_blank">' + mons[m].monitor_id + '</a>' + "<br/>(QA: " + mons[m].firstnm + " " + mons[m].lastnm + ")</th>";
            }
        }
        bld += "</tr></thead><tbody>";
        bld += '<tr><td class="autoqa-column-scorelabel">Overall Score</td>';
        bld += '<td class="autoqa-column-score-ai">' + myscore + '%' + '</td>';
        for (var m in mons) {
            if (mons[m].monitor_id != mymonitorid) {
                bld += '<td class="autoqa-column-score-manual">' + mons[m].pct_score.toFixed(2) + '%' + "</td>";
            }
        }
        bld += "</tr>";
        bld += "</tbody></table>";


        //bld += '<table><th>
    }

    bld += simpleblock('agentname', json.AgentName, 'Agent Name');

    bld += '<div class="autoqa-sections-summary-wrapper">';
    bld += '<div class="autoqa-sections-summary">';
    for (var i in json.Sections) {
        bld += '<div class="autoqa-section">';
        bld += '<div class="autoqa-section-name">';
        bld += json.Sections[i].SectionName;
        bld += '</div>'; //section-name
        bld += '<div class="autoqa-section-score">';
        if (typeof json.Sections[i].SectionScore === 'object') {
            bld += "" + json.Sections[i].SectionScore.Numerator + "/" + json.Sections[i].SectionScore.Denominator + " (" + json.Sections[i].SectionScore.Percentage + "%)";
        }
        else {
            bld += json.Sections[i].SectionScore;
        }
        bld += '</div>'; //section-score
        bld += '<a class="autoqa-section-link" href="#' + spacefree(json.Sections[i].SectionName) + '">Details</a>';
        bld += '</div>'; //section
    }
    //bld += simpleblock('sentiment', json.SentimentScore, 'Sentiment');
    bld += '<div class="autoqa-sentiment">';
    bld += '<label>Sentiment</label>';
    if (exists(json.SentimentScore)) {
        bld += '<span>' + json.SentimentScore + '</span>';
    }
    else if (exists(json.SentimentAnalysis)) {
        bld += '<span>' + json.SentimentAnalysis.SentimentScore + '</span>';
    }
    bld += '<a class="autoqa-section-link" href="#Sentiment">Details</a>';
    bld += '</div>';

    bld += '</div>'; //sections-summary
    bld += '</div>'; //sections-summary-wrapper

    if (exists(json.CallSummary)) {
        if (exists(json.CallSummary.Overview)) {
            bld += simpleblock('callsummary', json.CallSummary.Overview, 'Call Summary');
        }
        else if (exists(json.CallSummary.Summary)) {
            bld += simpleblock('callsummary', json.CallSummary.Summary, 'Call Summary');
        }
        else {
            if (typeof json.CallSummary === 'object') {
                //TODO: Should I fish for other names?
            }
            else {
                bld += simpleblock('callsummary', json.CallSummary, 'Call Summary');
            }
        }
    }

    if (exists(json.CoachingGuidance)) {
        if (exists(json.CoachingGuidance.FocusAreas)) {
            tmp = "<ul>";
            for (var i in json.CoachingGuidance.FocusAreas) {
                tmp += "<li>" + json.CoachingGuidance.FocusAreas[i] + "</li>";
            }
            tmp += "</ul>";
            bld += simpleblock('coachingguidance', tmp, 'Coaching Guidance');
        }
        else if (typeof json.CoachingGuidance === 'object') {
            tmp = "<ul>";
            for (var key in json.CoachingGuidance) {
                tmp += "<li>" + key + ": " + json.CoachingGuidance[key] + "</li>";
            }
            tmp += "</ul>";
            bld += simpleblock('coachingguidance', tmp, 'Coaching Guidance');
        }
        else {
            bld += simpleblock('coachingguidance', json.CoachingGuidance, 'Coaching Guidance');
        }
    }
    else if (exists(json.CallSummary)) {
        if (exists(json.CallSummary.CoachingGuidance)) {
            bld += simpleblock('coachingguidance', json.CallSummary.CoachingGuidance, 'Coaching Guidance');
        }
    }

    function commentsequals(sec,mon) {
        if (prefix == "da.") {
            if ((sqfcode == "4") || (sqfcode == "11")) {
                return (("QAComments-" + sec) == mon);
            }
            else if (sqfcode == "10") { //Shady, is there a better way?
                var sc = "";
                switch (sec) {
                    case "Sell Yourself":
                        sc = "A1";
                        break;
                    case "Discuss the home/determine what the best fit is":
                        sc = "A2";
                        break;
                    case "Introduce the plan to the caller":
                        sc = "A3";
                        break;
                    case "Overcome Objections / Capture customer and plan info / DPC / enter the sale":
                        sc = "A4";
                        break;
                    case "Close the call":
                        sc = "A5";
                        break;
                    default:
                        sc = "A1";
                }
                return (("QAComments-" + sc) == mon);
            }
        }
        return false;

    }

    function qstequals(ai, mon) {
        if (prefix == "da.") {
            if ((sqfcode == "4") || (sqfcode == "11")) {
                return (("Comp" + ai) == mon); //Note: This could be endsWith too.
            }
            else if (sqfcode == "10") {
                return mon.endsWith(ai);
            }
        }
        return false;
    }

    //QuestionNumber,QuestionText,Answer

    bld += '<div class="autoqa-sections-wrapper">';
    bld += '<div class="autoqa-sections">';
    for (var i in json.Sections) {
        bld += '<div id="' + spacefree(json.Sections[i].SectionName) + '" class="autoqa-section">';

        bld += '<div class="autoqa-section-name">';
        bld += json.Sections[i].SectionName;
        bld += '</div>'; //section-name
        bld += '<div class="autoqa-section-score">';
        bld += json.Sections[i].SectionScore;
        bld += '</div>'; //section-score

        if (exists(json.Sections[i].SectionComment)) {
            if (json.Sections[i].SectionComment == "No Comment") {
                json.Sections[i].SectionComment = "No comments made for this section.";
            }
            bld += '<div class="autoqa-section-comment-ai">';
            bld += '<div class="autoqa-section-comment-name">AI Comment:</div><div class="autoqa-section-comment-text-ai">' + json.Sections[i].SectionComment + '</div>';
            bld += '</div>'; //section-comment
        }

        var mysecname = json.Sections[i].SectionName; //TODO: Cheating for now so I can do direct comparison

        for (var m in mons) {
            if (mons[m].monitor_id != mymonitorid) {
                for (var q in mons[m].qsts) {
                    //if (mons[m].qsts[q].qstname == myqstname) {
                    if (commentsequals(mysecname, mons[m].qsts[q].qstname)) {
                        if (mons[m].qsts[q].answertext.toString().trim() != "") {
                            bld += '<div class="autoqa-section-comment-manual">';
                            bld += '<div class="autoqa-section-comment-name">' + mons[m].firstnm + ' ' + mons[m].lastnm + ' Comment:</div><div class="autoqa-section-comment-text-manual">' + mons[m].qsts[q].answertext + '</div>';
                            bld += '</div>'; //section-comment
                        }
                    }
                }
            }
        }

        bld += '<div class="autoqa-questions-wrapper">';

        if (!proposed) {
            for (var j in json.Sections[i].Questions) {
                bld += '<div class="autoqa-question">';

                bld += '<div class="autoqa-question-number">';
                bld += json.Sections[i].Questions[j].QuestionNumber;
                bld += '</div>'; //question-number
                bld += '<div class="autoqa-question-text">';
                bld += json.Sections[i].Questions[j].QuestionText;
                bld += '</div>'; //question-text
                bld += '<div class="autoqa-question-answer"';
                if (exists(json.Sections[i].Questions[j].Rationale)) {
                    bld += ' style="cursor:pointer;" title="' + json.Sections[i].Questions[j].Rationale + '"';
                    $(".qst").each(function () {
                        var str = $(this).attr("qst");
                        var match = str.match(/(\d+(\.\d+)?)$/);
                        var result = match ? match[0] : null;
                        if (result != null) {
                            if (result == json.Sections[i].Questions[j].QuestionNumber) {
                                $(this).closest("td").attr("title", json.Sections[i].Questions[j].Rationale);
                            }
                        }
                    });
                }
                bld += '>';
                bld += json.Sections[i].Questions[j].Answer;
                bld += '</div>'; //question-answer

                bld += '</div>'; //question
            }
            bld += '</div>'; //questions-wrapper
        }
        else {
            bld += '<table class="autoqa-table-questions"><thead><tr><th class="autoqa-column-questionnumber">#</th><th class="autoqa-column-question">Question</th><th class="autoqa-column-answer-ai">This Monitor<br />(AI Scored)</th>';
            for (var m in mons) {
                if (mons[m].monitor_id != mymonitorid) {
                    bld += '<th class="autoqa-column-answer-manual" title="Overall Score: ' + mons[m].pct_score + '%' + '">Monitor ' + '<a href="https://' + a$.urlprefix(true) + 'acuityapm.com/monitor/monitor_review.aspx?origin=report&prefix=da&id=' + mons[m].monitor_id + '" target="_blank">' + mons[m].monitor_id + '</a>' + "<br/>(QA: " + mons[m].firstnm + " " + mons[m].lastnm + ")</th>";
                }
            }
            bld += "</tr></thead><tbody>";
            for (var j in json.Sections[i].Questions) {
                bld += '<tr><td class="autoqa-column-questionnumber">';
                bld += json.Sections[i].Questions[j].QuestionNumber;
                bld += '</td><td class="autoqa-column-question">';
                bld += json.Sections[i].Questions[j].QuestionText;
                bld += '</td>'; //question-text
                bld += '<td class="autoqa-column-answer-ai"';
                if (exists(json.Sections[i].Questions[j].Rationale)) {
                    bld += ' style="cursor:pointer;" title="' + json.Sections[i].Questions[j].Rationale + '"';
                    $(".qst").each(function () {
                        var str = $(this).attr("qst");
                        var match = str.match(/(\d+(\.\d+)?)$/);
                        var result = match ? match[0] : null;
                        if (result != null) {
                            if (result == json.Sections[i].Questions[j].QuestionNumber) {
                                $(this).closest("td").attr("title", json.Sections[i].Questions[j].Rationale);
                            }
                        }
                    });
                }
                bld += '>';
                bld += json.Sections[i].Questions[j].Answer;
                bld += '</td>'; //question-answer

                var myqn = json.Sections[i].Questions[j].QuestionNumber;
                /*
                if ((sqfcode == "4") || (sqfcode == "11")) {
                    myqstname = "Comp" + json.Sections[i].Questions[j].QuestionNumber; //TODO: Cheating for now so I can do direct comparison
                }
                else if ((sqfcode == "10")) {
                }
                */

                for (var m in mons) {
                    if (mons[m].monitor_id != mymonitorid) {
                        for (var q in mons[m].qsts) {
                            //if (mons[m].qsts[q].qstname == myqstname) {
                            if (qstequals(myqn, mons[m].qsts[q].qstname)) {
                                bld += '<td class="autoqa-column-answer-manual">' + mons[m].qsts[q].answertext + "</td>";
                            }
                        }
                    }
                }
                bld += "</tr>";
            }
            bld += "</tbody></table>";
        }

        try {
            if ( exists(json.QAComments[json.Sections[i].SectionName])) {
                bld += '<div class="autoqa-qa-comments">';
                bld += '<label>QA Comments:</label>';
                bld += '<span>' + json.QAComments[json.Sections[i].SectionName] + '</span>';
                bld += '</div>'; //qa-comments
            }
        }
        catch (e) { };

        bld += '</div>'; //section
    }
    bld += '</div>'; //sections
    bld += '</div>'; //sections-wrapper

    bld += '<div class="autoqa-questions-wrapper">';
    for (var i in json.Questions) {
        bld += '<div class="autoqa-question">';
        bld += '<div class="autoqa-question-number">';
        bld += json.Questions[i].QuestionNumber;
        bld += '</div>'; //question-number
        bld += '<div class="autoqa-question-text">';
        bld += json.Questions[i].QuestionText;
        bld += '</div>'; //question-text
        bld += '<div class="autoqa-question-answer">';
        bld += json.Questions[i].QuestionAnswer;
        bld += '</div>'; //question-answer

        bld += '</div>'; //question
    }
    bld += '</div>'; //questionss-wrapper

    bld += '<div id="Sentiment" class="autoqa-sentiment-wrapper">';
    if (typeof json.SentimentAnalysis === 'object') {
        bld += simpleblock('sentiment-score', json.SentimentAnalysis.SentimentScore, 'Sentiment');
        bld += simpleblock('sentiment-analysis', json.SentimentAnalysis.SentimentAnalysis, 'Sentiment Analysis');
    }
    else {
        bld += simpleblock('sentiment-score', json.SentimentScore, 'Sentiment');
        bld += simpleblock('sentiment-analysis', json.SentimentAnalysis, 'Sentiment Analysis');
    }
    bld += '</div>';

    bld += '<div class="autoqa-dialog-wrapper" style="position:relative;">';
    if (exists(json.DiarizedDialog) || exists(jsontrans)) {
        bld += '<label>Diarized Dialog:</label>';
    }
    else {
        bld += '<label>Diarized Dialog Not Found</label>';
    }
    bld += '<input type="button" class="ac-ai-rediarize" style="position: absolute;right:20px;top:10px;cursor:pointer;" value="Re-Diarize" />';
    bld += '<span class="ac-audio" style="display:block;text-align:center;"></span>';
    if (jsontrans && exists(jsontrans)) {
        if (exists(jsontrans.diarized_dialog)) {
            json.DiarizedDialog = jsontrans.diarized_dialog;
        }
        else if (exists(jsontrans.dialog)) {
            json.DiarizedDialog = jsontrans.dialog;
        }
    }
    for (var i in json.DiarizedDialog) {
        bld += '<div class="autoqa-dialog-' + json.DiarizedDialog[i].Participant + '">';
        bld += '<label>' + json.DiarizedDialog[i].Participant + '</label>';
        bld += '<span>' + json.DiarizedDialog[i].Dialog + '</span>';
        bld += '</div>'; //dialog-<participant>
    }
    bld += '</div>'; //dialog-wrapper


    bld += '</div>'; //wrapper
    bld += '</div>'; //wrapper2

    return bld;

}

try {
    module.exports = {
        nodeJsonConversion: function (j, t) {
            return jsonConversion(j, t);
        }
    }
}
catch (e) { } //Will fail except as nodejs include.