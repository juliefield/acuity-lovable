/*
draft-table  DONE
draft-table-drafted DOne
draft-team-table DON
final-team-table
*/
// A-GAME xTreme Draft

function DraftViewModel(o) {
    var self = this;
    var testq = "";
    var testdateoffset = 0;
    var debug = false;

    var drafttable = null;
    var startup = true;

    //Gets that can piggy-back onto the ping.

    var pingGetTime = true; //Do this on the first ping.
    var pingGetChatees = true;
    var pingInitDraftTable = true;

    var uiddetail = "";
    var oppTimeout, pingTimeout, draftTimeout, finishTimeout, failsafeTimeout;
    var draftwarning = false;
    var draftstarted = false;
    var draftfinished = false;
    var draftstartrendered = false; //Set to true when my local counter detects it's time to start the draft.
    var draftfinishedrendered = false;
    var draftteams = [];
    var stopping = false;

    var testq = ""; //All draft pools are now live, not TEST.

    /* TODO: TODO: TODO: TODO: TODO: TODO: TODO: TODO: TODO: TODO: TODO: TODO: TODO: TODO: TODO: TODO: TODO:
    var myn = new Date("Thu Oct 06 2016 02:02:19 GMT-0400 (US Eastern Daylight Time)");
    alert("mynow=" + myn);
    alert("myn ms=" + myn.getTime());
    */

    var PRF = -1;

    var draftroomclosetime = null;

    var chateesloaded = false;
    var mydraftposition = 0;

    var paused = false;

    //Settings

    self.oTheme = ko.observable("unknown");

    self.oLeagueName = ko.observable("Test Fantasy League");
    self.oDraftID = ko.observable("");  //Set by the draft starter
    self.oMock = ko.observable(true); //Set by the draft starter
    self.oRounds = ko.observable(0);
    self.oTeamCount = ko.observable(0);
    self.oBeginTime = ko.observable("..retrieving");
    self.oCountdown = ko.observable("");

    self.oPrompt = ko.observable("Select Draft Position<br />While Waiting...");
    $(".draft-desc-prompt").css("backgroundColor", "blue").css("fontWeight", "bold").css("color","white");

    self.oDraftingNow = ko.observable(false);
    disableautopick(false);

    self.oPending = ko.observable(false);

    var begintime = new Date();
    var opppickendtime = new Date();
    var curpick = 0;

    if (a$.exists(o.theme)) {
        self.oTheme(o.theme);  //ko hello world.
    }

    //These are all potentially re-drawn, so handle them with updates.
    $(".draft-table-tablesorter").eq(0).tablesorter({});
    $(".draft-table-drafted-tablesorter").eq(0).tablesorter({});
    $(".draft-team-table-tablesorter").eq(0).tablesorter({});
    $(".final-team-table-tablesorter").eq(0).tablesorter({});

    $(".draft-detail").html("");

    self.oUid = ko.observable("user");
    ko.postbox.subscribe("uid", function (newValue) {
        self.oUid(newValue);
    });

    $(".draft-select-pause input").unbind().bind("click", function () {
        var pausing = false;
        if ($(this).is(":checked")) {
            pausing = true;
        }
        a$.ajax({
            type: "GET" /*POST*/, service: "JScript", async: true, data: { lib: "draft", prefix: PRF, cmd: "pausedraft", guid: guid, pausing: pausing }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: draftpaused
        });
        function draftpaused(json) {
            if (a$.jsonerror(json)) {
            }
        }
    });
    $(".draft-select-pause").hide();


    //Do a ping loop, and return the following stuff:
    // *) List of all others currently doing the mock draft.
    // *) State flag for if in Countdown to start, drafting, or draft completed.
    //  If in countdown, then
    //     *) Time that the next draft begins.
    //     *) Minutes/Seconds until the draft begins.

    //Order of people in the queue is important and must be maintained.
    //Must keep track of when people drop off, but not eliminate them (?)

    //Pings requesting status info (which should occur once every 15 seconds maybe?) need to include a passed back list of who the client already has, right?
    //..or maybe there's a separate request for detailed info...

    //FAN interface tables
    //  FAN_PICKS username, user_id, boiler
    //  

    //Draft support tables
    //FAN_DRAFT

    var MANAGELEVEL = 0;

    var lastadd = 0;

    var lastpingtimestamp = 0;
    var PINGDELAY = 1000 * 2; //2 seconds
    var ERRORDELAY = 1000 * 15; //15 seconds

    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });



    $(".draft-chat-returnline").unbind().bind("focus", function () {
        $(".draft-chat-inputline").focus();
    });
    $(".draft-chat-inputline").unbind().bind("keypress", function (ev) {
        if (window.event && window.event.keyCode == 13) {
            $(this).trigger("change");
        }
        else if (ev && ev.keyCode == 13) {
            $(this).trigger("change");
        }
    }).bind("change", function () {
        var value = $(this).val();
        value = value.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\\/g, "|");
        if (value != "") {
            $(this).val("");
            $(".draft-chatstream").append('<div class="draft-chatstream-sent">' + value + '</div><div style="clear:both;"></div>');
            $('.draft-chatstream-wrapper').scrollTop($('.draft-chatstream-wrapper')[0].scrollHeight);
            a$.ajax({
                type: "GET" /*POST*/, service: "JScript", async: true, data: { lib: "draft", prefix: PRF, cmd: "chatpost", guid: guid /*, cps: null //TO ALL */, post: value }, dataType: "json", cache: false, error: a$.ajaxerror,
                success: chatposted
            });
            function chatposted(json) {
                if (a$.jsonerror(json)) {
                }
            }
        }
    });

    function registerdraftingintent(drafting) {
        if (!drafting) {
            mydraftposition = 0;
            draftstartrendered = false;
        }
        a$.ajax({
            type: "GET" /*POST*/, service: "JScript", async: true, data: { lib: "draft", prefix: PRF, cmd: "draftingpost", guid: guid, drafting: drafting }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: draftingposted
        });
        function draftingposted(json) {
            if (a$.jsonerror(json)) {
            }
        }
    }

    $(".draft-select-observe input").unbind().bind("change", function () {
        registerdraftingintent(!$(this).is(":checked")); //Drafting if not an observer
    });

    function disableautopick(yes) {
        if (yes) {
            $(".draft-select-autopick").addClass("menu-disabled")
            $(".draft-select-autopick input").addClass("menu-disabled").unbind().prop("disabled", true);
        }
        else {
            $(".draft-select-autopick").removeClass("menu-disabled");
            $(".draft-select-autopick input").prop("disabled",false).unbind().bind("change", function () {
                var auto = $(this).is(":checked");

                a$.ajax({
                    type: "GET" /*POST*/, service: "JScript", async: true, data: { lib: "draft", prefix: PRF, cmd: "autopost", guid: guid, auto: auto }, dataType: "json", cache: false, error: a$.ajaxerror,
                    success: autoposted
                });
                function autoposted(json) {
                    if (a$.jsonerror(json)) {
                    }
                }
            });
        }
    }

    $(".draft-table-menu-player").unbind().bind("click", function () {
        $(".draft-table-pane").show();
        $(".draft-team-table-pane").hide();
    });

    $(".draft-q-save").unbind().bind("click", function () {
        var csrs = [];
        $(".draft-q-uid").each(function () {
            csrs.push($(this).html());
        });
        a$.ajax({ type: "POST", service: "JScript", async: true, data: { lib: "fan", test: testq, testdateoffset: testdateoffset, cmd: "draftQueueSave", csrs: csrs, mock: oMock(), draftstarted: draftstarted
        },
            dataType: "json", cache: true, error: a$.ajaxerror, success: qadded //TODO: See if you can hook up this "progress" member, it would be very cool.
        });
        function qadded(json) {
            if (a$.jsonerror(json)) {
            }
            else {
                $(".draft-q-saved").show();
            }
        }

    });

    function ping() {
        if (stopping) {
            clearTimeout(pingTimeout);
            clearTimeout(failsafeTimeout);
            return;
        }
        var rn = (new Date).getTime();
        if ((rn - lastpingtimestamp) < PINGDELAY) return; //fail-safe for multi-looping.
        lastpingtimestamp = (new Date).getTime();
        if (!navigator.onLine) {
            pingTimeout = setTimeout('draft.ping()', PINGDELAY);
            return;
        }
        var topq = "";
        if ($(".draft-select-autopick input").eq(0).is(":checked")) {
            if ($(".draft-q-uid").eq(0) != null) {
                topq = $(".draft-q-uid").eq(0).html();
                //alert("debug: passing topq = " + topq);
            }
        }
        a$.ajax({
            type: "GET" /*POST*/, service: "JScript", async: true, data: { lib: "draft", prefix: PRF, cmd: "pingdraft", managed: MANAGELEVEL, urlprefix: a$.urlprefix(), guid: guid, devmode: false,
                getTime: pingGetTime,
                getChatees: pingGetChatees,
                initDraftTable: pingInitDraftTable,
                topq: topq
            }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: pung
        });

        pingGetTime = false;
        pingGetChatees = false;
        //pingInitDraftTable = false;

        function pung(json) {
            if (a$.jsonerror(json)) {
                pingTimeout = setTimeout('draft.ping()', ERRORDELAY);
            }
            else {
                if (a$.exists(json.eval)) {
                    //alert("debug: eval found");
                    eval(json.eval);
                }
                var rightnow = (new Date).getTime();

                //DONE: Draft Table is part of initial state.  All OTHER actions are queued.
                if (a$.exists(json.draftstarted)) {
                    draftstarted = json.draftstarted;
                }
                if (paused) {
                    if (!a$.exists(json.paused)) {
                        paused = false;
                        $(".draft-select-pause input").prop('checked', false);
                    }
                }
                else {
                    if (a$.exists(json.paused)) {
                        paused = true;
                        $(".draft-select-pause input").prop('checked', true);
                    }
                }
                if (!draftstarted) {
                    draftstartrendered = false;
                    $(".draft-select-pause").hide();
                }
                if (json.draftfinished) {
                    $(".draft-select-pause").hide();
                    if (!draftfinishedrendered) {
                        //draftfinishedrendered = true;
                        oPrompt("FINISHED - " + json.finishedreason);
                        $(".draft-desc-prompt").css("backgroundColor", "blue").css("fontWeight", "bold").css("color", "white");
                        $(" td", $(".draft-opp-table-body tr").eq(curpick - 1)).eq(3).html("&#x2713");
                        draftstarted = false;
                        draftfinished = true;
                        var now = new Date();
                        draftroomclosetime = new Date(now.getTime() + json.countdown);
                        $(".draft-desc-begintime").hide();
                        $(".draft-desc-closetime").show();
                        clearTimeout(oppTimeout);
                        showfinishcountdown();
                    }
                }
                if (draftstarted) {
                    $(".draft-select-pause").show();
                    //oPrompt("Round=" + json.round + ",#=" + json.team + ",pick=" + json.pick);
                    $(".draft-opp-table-body tr").css("background-color", "").css("color", "").css("font-weight", "");
                    if (json.pick > 1) {
                        $(" td", $(".draft-opp-table-body tr").eq(json.pick - 2)).eq(3).html("&#x2713");
                    }
                    opppickendtime = new Date(rightnow + json.countdown);
                    curpick = json.pick;
                    oppTimeout = setTimeout(showoppcountdown, 1000);
                    $(".draft-opp-table-body tr").eq(json.pick - 1).css("background-color", "blue").css("color", "white").css("font-weight", "bold");
                    //Scroll it to the middle.
                    if (a$.exists(json.team)) {
                        $('.draft-opp-wrapper').scrollTop($('.draft-opp-wrapper')[0].scrollHeight * (json.pick / (oTeamCount() * oRounds())) - (($('.draft-opp-wrapper').eq(0).height() / 2) - 20));
                        if (json.team == mydraftposition) {
                            disableautopick(true);
                            if ($(".draft-select-autopick input").eq(0).is(":checked")) {
                                oDraftingNow(false);
                                oPrompt("Auto-picking # " + json.pick + "<br />To pick manually next round,<br />un-check Auto-Pick");
                            }
                            else {
                                oDraftingNow(true);
                                if ($(".draft-detail").html() == "") {
                                        $(".draft-detail-prompt").show();
                                }
                                oPrompt("Draft Now!<br />Select Player, Click 'DRAFT PLAYER'");
                            }
                            $(".draft-desc-prompt").css("backgroundColor", "green").css("fontWeight", "bold").css("color", "white");
                        }
                        else {
                            oDraftingNow(false); //Another live player drafting OR I'm in auto-pick.
                            disableautopick(false);
                            if (!$(".draft-select-observe input").eq(0).is(":checked")) {
                                var lastpick = (oRounds() * oTeamCount());
                                var nextpick = ((json.round - 1) * oTeamCount()) + mydraftposition;
                                if (nextpick < json.pick) {
                                    nextpick += oTeamCount();
                                }
                                if (nextpick <= lastpick) {
                                    oPrompt("Drafting Pick # " + json.pick + "<br />" + (nextpick - json.pick) + " picks remaining before your turn.");
                                }
                                else {
                                    oPrompt("Drafting Pick # " + json.pick + "<br />You are done drafting.");
                                }
                            }
                            else {
                                oPrompt("Drafting<br />Pick # " + json.pick);
                            }
                            $(".draft-desc-prompt").css("backgroundColor", "darkred").css("fontWeight", "bold").css("color", "white");
                        }
                    }
                    else {
                        oDraftingNow(false); //An auto player drafting
                        disableautopick(false);
                    } 
                }

                if (a$.exists(json.draftTable)) {
                    pingInitDraftTable = false;
                    drafttable = json.draftTable;
                    var bld = "";
                    $(".draft-table-body").html("");
                    for (var i in drafttable) {
                        bld = "<tr";
                        if (drafttable[i].selected) {
                            bld += ' style="display:none;"';
                        }
                        bld += '><td style="display:none;">' + drafttable[i].uid + '</td><td>' + drafttable[i].name + '</td><td>' + drafttable[i].project + '</td><td>' + drafttable[i].location + '</td><td>' + drafttable[i].team + '</td><td class="centered">' + drafttable[i].scores[0].score.toFixed(1) + '</td><td class="centered">' + drafttable[i].scores[1].score.toFixed(1) + '</td><tr>';
                        $(".draft-table-body").append(bld);
                    }

                    $(".draft-table-tablesorter").eq(0).trigger("update");
                    
                    $(".draft-table-body tr").hover(function () {
                        $(" td", this).css("background-color", "yellow");

                    }, function () {
                        var uid = $(" td", $(this)).eq(0).html();
                        $(" td", this).css("background-color", "");
                        if (uid == uiddetail) {
                            $(" td", this).addClass("draft-detail-highlight");
                        }
                    });
                    $(".draft-table-body td").bind("click", function () {
                        var uid = $(" td", $(this).parent()).eq(0).html();
                        $(".draft-table-body tr td").removeClass("draft-detail-highlight");
                        $(".draft-table-q-body tr td").removeClass("draft-detail-highlight");
                        $(" td", $(this).parent()).addClass("draft-detail-highlight");
                        $(".draft-table-q-body td").each(function () {
                            var tuid = $(" td", $(this).parent()).eq(0).html();
                            if (tuid == uid) {
                                $(" td", $(this).parent()).addClass("draft-detail-highlight");
                            }
                        });
                        $(".draft-detail-buttons").hide();
                        for (var i in drafttable) {
                            if (drafttable[i].uid == uid) {
                                bld = '<span class="draft-selected-uid">' + uid + '</span>';
                                bld += 'Name:&nbsp;' + drafttable[i].name + '<br />';
                                bld += 'Team:&nbsp;' + drafttable[i].team + '<br />';
                                bld += 'Hire Date:&nbsp;' + drafttable[i].hiredt + '<br />';
                                $(".draft-detail-prompt").hide();
                                $(".draft-detail").html(bld);
                                var foundinq = false;
                                $(".draft-table-q-body tr").each(function () {
                                    var tuid = $(" td", this).eq(0).html();
                                    if (tuid == uid) {
                                        foundinq = true;
                                    }
                                });
                                if (foundinq) {
                                    $(".draft-detail-button-q").hide();
                                }
                                else {
                                    $(".draft-detail-button-q").show();
                                }
                                $(".draft-detail-buttons").show();
                                uiddetail = uid;
                                break;
                            }
                        }
                    });

                    a$.ajax({
                        type: "GET", service: "JScript", async: true, data: { lib: "draft", prefix: PRF, cmd: "teamget", guid: guid, teamuid: oUid() }, dataType: "json", cache: false, error: a$.ajaxerror,
                        success: teamgot
                    });
                    function teamgot(json) {
                        if (a$.jsonerror(json)) {
                        }
                        else {
                            if (json.members.length > 0) {
                                for (var i in drafttable) {
                                    for (var j in json.members) {
                                        if (drafttable[i].uid == json.members[j].uid) {
                                            var bld = '<tr><td style="display:none;">' + drafttable[i].uid + '</td><td>' + json.members[j].draft.pick + '</td><td>' + drafttable[i].name + '</td><td>' + drafttable[i].project + '</td><td>' + drafttable[i].location + '</td><td>' + drafttable[i].team + '</td><td class="centered">' + drafttable[i].scores[0].score.toFixed(1) + '</td><td class="centered">' + drafttable[i].scores[1].score.toFixed(1) + '</td><tr>';
                                            $(".draft-table-drafted-body").append(bld);
                                            break;
                                        }
                                    }
                                }
                            }
                            $(".draft-table-drafted-tablesorter").eq(0).trigger("update");
                        }
                    }

                    $(".draft-detail-button-draft").unbind().bind("click", function () {
                        oDraftingNow(false); //Shuts off the button.
                        var uid = $(" span", $($(this).parent()).parent()).eq(0).html();
                        for (var i in drafttable) {
                            if (drafttable[i].uid == uid) {
                                uiDraftPlayer(i, curpick);
                                a$.ajax({
                                    type: "GET" /*POST*/, service: "JScript", async: true, data: { lib: "draft", prefix: PRF, cmd: "draftplayer", guid: guid, draftee: uid }, dataType: "json", cache: false, error: a$.ajaxerror,
                                    success: draftingposted
                                });
                                function draftingposted(json) {
                                    if (a$.jsonerror(json)) {
                                    }
                                }
                                break;
                            }
                        }
                    });
                    $(".draft-detail-button-q").unbind().bind("click", function () {
                        var uid = $(" span", $($(this).parent()).parent()).eq(0).html();
                        for (var i in drafttable) {
                            if (drafttable[i].uid == uid) {
                                bld = '<tr><td class="draft-q-uid">' + drafttable[i].uid + '</td><td class="draft-q-remove">X</td><td class="draft-q-up">&uarr;</td><td class="draft-q-down">&darr;</td><td>' + drafttable[i].name + '</td><td>' + drafttable[i].team + '</td></tr>'; //<td class="centered">' + drafttable[i].scores[0].score.toFixed(1) + '</td><td class="centered">' + drafttable[i].scores[1].score.toFixed(1) + '</td><td class="centered">' + drafttable[i].scores[2].score.toFixed(1) + '</td></tr>';
                                $(".draft-table-q-body").append(bld);
                                $(".draft-detail-button-q").hide();
                                $(".draft-table-q-body td").each(function () {
                                    var tuid = $(" td", $(this).parent()).eq(0).html();
                                    if (tuid == uid) {
                                        $(" td", $(this).parent()).addClass("draft-detail-highlight");
                                    }
                                });
                                break;
                            }
                        }
                        activateQ();
                    });
                }

                if (a$.exists(json.q)) { //Note: We won't get here unless the drafttable has already been populated (because of order on the server).
                    bld = "";
                    $(".draft-table-q-body").html("");
                    for (var i in json.q) {
                        //See if the player to q is in the draft table.
                        var there = false;
                        var selected = false;
                        for (var j in drafttable) {
                            if (json.q[i].uid == drafttable[j].uid) {
                                there = true;
                                selected = drafttable[j].selected;
                            }
                        }
                        if (!selected) {
                            if (!there) {
                                $(".draft-chatstream").append('<div class="draft-chatstream-received">DraftRoom:' + "Your queue member - " + json.q[i].name + " (" + json.q[i].uid + ") isn't in the draft pool.  The agent has been removed from your queue for now." + '</div><div style="clear:both;"></div>');
                            }
                            else {
                                bld += '<tr><td class="draft-q-uid">' + json.q[i].uid + '</td><td class="draft-q-remove">X</td><td class="draft-q-up">&uarr;</td><td class="draft-q-down">&darr;</td><td>' + json.q[i].name + '</td><td>' + json.q[i].team + '</td></tr>'; //<td class="centered">' + json.q[i].scores[0].score.toFixed(1) + '</td><td class="centered">' + json.q[i].scores[1].score.toFixed(1) + '</td><td class="centered">' + json.q[i].scores[2].score.toFixed(1) + '</td></tr>';
                            }
                        }
                    }
                    $('.draft-chatstream-wrapper').scrollTop($('.draft-chatstream-wrapper')[0].scrollHeight);
                    $(".draft-table-q-body").append(bld);
                    $(".draft-detail-button-q").hide();
                    activateQ();
                }

                if (a$.exists(json.posts)) {
                    for (var i in json.posts) {
                        switch (json.posts[i].action) {
                            case "SetTime":
                                oBeginTime(json.posts[i].beginTime);
                                begintime = new Date(rightnow + json.posts[i].countdown);
                                oRounds(json.posts[i].draftrounds);
                                oTeamCount(json.posts[i].draftteamcount);
                                oMock(json.posts[i].mock);
                                if (oMock()) {
                                    oDraftID("<b>Mock</b> Draft # " + json.posts[i].draftid);
                                }
                                else {
                                    oDraftID("Draft # " + json.posts[i].draftid);
                                }
                                //uiInitRounds();
                                //TODO: add "draftstarted" member
                                showcountdown();
                                break;
                            /*
                            case "FinishDraft":
                                oPrompt("FINISHED - " + json.posts[i].reason);
                                $(".draft-desc-prompt").css("backgroundColor", "blue").css("fontWeight", "bold").css("color", "white");
                                $(" td", $(".draft-opp-table-body tr").eq(curpick - 1)).eq(3).html("&#x2713");
                                draftstarted = false;
                                draftfinished = true;
                                var now = new Date();
                                draftroomclosetime = new Date(now.getTime() + json.posts[i].countdown);
                                $(".draft-desc-begintime").hide();
                                $(".draft-desc-closetime").show();
                                showfinishcountdown();
                                break;
                            */
                            case "DraftReset":
                                $(".draft-desc-begintime").show();
                                $(".draft-desc-closetime").hide();
                                draftstarted = false;
                                draftwarning = false;
                                draftstartrendered = false;
                                draftfinishedrendered = false;
                                oPrompt("Draft Reset<br />You May Modify Draft Position...");
                                $(".draft-desc-prompt").css("backgroundColor", "blue").css("fontWeight", "bold").css("color", "white");
                                $(".draft-reset").hide();
                                $(".draft-select-observe").show();
                                $(".draft-table-drafted-body").html("");
                                $(".draft-table-menu-teams").addClass("menu-disabled").unbind();

                                draftfinished = false;
                                draftroomclosetime = null;
                                pingGetTime = true;
                                draftteams = []; //leaky?
                                break;
                            case "SetRounds":
                                break;
                            case "DummyPick":
                                var found = false; ;
                                $(".draft-table-body tr").each(function () {
                                    if (!found) {
                                        var uid = $(" td", this).eq(0).html();
                                        if (uid == json.posts[i].draftee) {
                                            $(this).css("color", "white").css("background-color", "blue");
                                            found = true;
                                        }
                                    }
                                });
                                break;
                            case "DraftPlayer":
                                if (json.posts[i].drafterteam != 0) {
                                    if (a$.exists(draftteams[json.posts[i].drafterteam])) {
                                        draftteams[json.posts[i].drafterteam].push({ uid: json.posts[i].draftee.toString().toLowerCase(), pick: json.posts[i].draftpick });
                                    }
                                    else {
                                        alert("debug: draftteams array not initialized, technical problem, hmmm...");
                                    }
                                }
                                if ((json.posts[i].drafterguid == guid) && (!$(".draft-select-autopick input").eq(0).is(":checked"))) {

                                    //alert("debug: draft postback to myself, ignoring for now.  guid= " + guid);
                                }
                                else if (json.posts[i].drafter.toString().toLowerCase() == self.oUid().toLowerCase()) { //Note: You don't receive this for yourself unless you're remote.
                                    var uid = json.posts[i].draftee.toString().toLowerCase();
                                    for (var j in drafttable) {
                                        if (drafttable[j].uid == uid) {
                                            uiDraftPlayer(j, json.posts[i].draftpick);
                                            break;
                                        }
                                    }
                                    //alert("debug: TODO: Do remote draft to yourself");
                                }
                                else {
                                    //Remove the player entirely.
                                    //TODO: Record the player as drafted to the other team.
                                    $(".draft-table-body tr").each(function () {
                                        var tuid = $(" td", this).eq(0).html();
                                        if (tuid == json.posts[i].draftee) {
                                            //$(this).remove(); //Hiding now
                                            $(this).hide();
                                        }
                                    });
                                    $(".draft-table-q-body tr").each(function () {
                                        var tuid = $(" td", this).eq(0).html();
                                        if (tuid == json.posts[i].draftee) {
                                            $(this).remove();
                                        }
                                    });
                                    if (uiddetail == json.posts[i].draftee) {
                                        $(".draft-detail-prompt").hide();
                                        $(".draft-detail").html("");
                                        $(".draft-detail-buttons").hide();
                                    }
                                }
                                break;
                            case "Message":
                                if (json.posts[i].from.toString().toLowerCase() == self.oUid().toLowerCase()) {
                                    $(".draft-chatstream").append('<div class="draft-chatstream-sent">' + json.posts[i].msg.toString() + '</div><div style="clear:both;"></div>');
                                }
                                else {
                                    $(".draft-chatstream").append('<div class="draft-chatstream-received">' + json.posts[i].from.toString() + ": " + json.posts[i].msg.toString() + '</div><div style="clear:both;"></div>');
                                }
                                break;
                            default:
                                alert("Debug: Unrecognized Action");
                                break;
                        }
                    }
                    $('.draft-chatstream-wrapper').scrollTop($('.draft-chatstream-wrapper')[0].scrollHeight);
                }

                //TODO: q.  Note that if this is queued, it needs to come after the "SetTime" operation is queued server-side.
                if (a$.exists(json.chatees)) {
                    $(".draft-ers-wrapper").show().html('<label>Draft Sequence</label><div class="draft-ers-subwrapper"></div>');
                    $(".draft-obs-wrapper").html('<label>Observers</label>');
                    var order = 0;
                    var tc = oTeamCount();
                    var bld = "";
                    for (t = 1; t <= tc; t++) {
                        var found = false;
                        for (var i in json.chatees) {
                            if (json.chatees[i].drafting) {
                                if (json.chatees[i].draftposition == t) {
                                    found = true;
                                    bld = '<div class="draft-er"><div class="draft-er-image"></div>';
                                    bld += '<div class="draft-er-name">' + json.chatees[i].name + '</div>';
                                    if (json.chatees[i].pinging) {
                                        bld += '<div class="draft-er-order">' + t + '</div>';
                                    }
                                    else {
                                        bld += '<div class="draft-er-order">' + t + ' (absent)</div>';
                                    }
                                    bld += '</div>';
                                    $(".draft-ers-subwrapper").append(bld);
                                    break;
                                }
                            }
                        }
                        if (!found) {
                            if (draftwarning || draftstarted || draftfinished) {
                                bld = '<div class="draft-er"><div class="draft-er-image"></div>';
                            }
                            else {
                                bld = '<div class="draft-er"><div class="draft-er-move"><br /><br />Move</div>';
                            }
                            bld += '<div class="draft-er-name">Team</div>';
                            bld += '<div class="draft-er-order">' + t + '</div>';

                            $(".draft-ers-subwrapper").append(bld);
                        }
                    }
                    for (var i in json.chatees) {
                        if (json.chatees[i].uid == oUid()) {
                            if (startup || (!(draftwarning || draftstarted))) {
                                startup = false;
                                if (json.chatees[i].drafting && (json.chatees[i].draftposition != 0)) {
                                    mydraftposition = json.chatees[i].draftposition;
                                    $(".draft-select-autopick input").prop('checked', json.chatees[i].auto);
                                    $(".draft-select-autopick").show();
                                }
                                else {
                                    mydraftposition = json.chatees[i].draftposition;
                                    $(".draft-select-autopick").hide();
                                }
                            }
                            if (json.chatees[i].drafting && (json.chatees[i].draftposition != 0)) {
                                $(".draft-select-observe input").prop("checked", false);
                            }
                            else {
                                $(".draft-select-observe input").prop("checked", true);
                            }
                        }
                    }

                    uiInitRounds(json.chatees);

                    $(".draft-er-move").unbind().bind("click", function () {
                        oPending(true);
                        var newposition = $(this).parent().index() + 1;
                        a$.ajax({
                            type: "GET" /*POST*/, service: "JScript", async: true, data: { lib: "draft", prefix: PRF, cmd: "draftposition", guid: guid, position: newposition }, dataType: "json", cache: false, error: a$.ajaxerror,
                            success: draftingpos
                        });
                        function draftingpos(json) {
                            if (a$.jsonerror(json)) {
                            }
                        }
                    });
                    $(".draft-ers-subwrapper").css("width", (tc * 150) + "px");
                    for (var i in json.chatees) {
                        if (!json.chatees[i].drafting) {
                            if (json.chatees[i].pinging) {
                                bld = '<div class="draft-obs-name">' + json.chatees[i].name + '</div>';
                                $(".draft-obs-wrapper").append(bld);
                            }
                        }
                    }
                }
                clearTimeout(failsafeTimeout);
                failsafeTimeout = setTimeout('draft.ping()', 30 * 1000); //Failsafe

                pingTimeout = setTimeout('draft.ping()', PINGDELAY); //duck
            }
            oPending(false);

        }

        function uiInitRounds(chatees) {

            var bld = "";
            var rc = oRounds();
            var tc = oTeamCount();
            if (!a$.exists(chatees)) {
                for (var r = 1; r <= rc; r++) {
                    for (var t = 1; t <= tc; t++) {
                        bld += '<tr><td>' + r + '</td><td>' + t + '</td><td>Team ' + t + '</td><td>&nbsp;</td></tr>';
                    }
                }
            }
            else {
                function addline(r, t) {
                    var found = false;
                    for (var i in chatees) {
                        if (chatees[i].drafting) {
                            if (chatees[i].draftposition == t) {
                                found = true;
                                bld += '<tr><td>' + r + '</td><td>' + t + '</td><td>' + chatees[i].name + '</td>';
                                break;
                            }
                        }
                    }
                    if (!found) {
                        bld += '<tr><td>' + r + '</td><td>' + t + '</td><td>Team ' + t + '</td>';
                    }
                    //bld += "<td>&#x2713</td></tr>"; //debug: test: checkmark
                    bld += "<td>&nbsp;</td></tr>";
                }
                for (var r = 1; r <= rc; r++) {
                    //straight
                    for (t = 1; t <= tc; t++) {
                        addline(r, t);
                    }

                    //snake
                    //if (r % 2) {
                    //    for (t = 1; t <= tc; t++) {
                    //        addline(r, t);
                    //    }
                    //}
                    //else {
                    //    for (t = tc; t >= 1; t--) {
                    //        addline(r, t);
                    //    }
                    //}
                }
                chateesloaded = true;
            }
            $(".draft-opp-table-body").html(bld);
            $(".draft-opp-table-body tr td").unbind().bind("click", function () {
                var team = $(" td", $(this).parent()).eq(1).html();
                var teamname = $(" td", $(this).parent()).eq(2).html();
                var found = false;
                if (a$.exists(draftteams[team])) {
                    if (draftteams[team].length > 0) { //Assume that we have them all (horrible assumption).
                        found = true;
                    }
                }
                if (false) { // (found) { //TODO: This is a bit inefficient, but there are too many cases where the teams would be incomplete with just this test.  Look for a better way.
                    //alert("debug: (internal) Show team where team # = " + team);
                    showteamtable(team, teamname);
                }
                else {
                    //alert("debug: (external) Show team where team # = " + team);
                    a$.ajax({
                        type: "GET", service: "JScript", async: true, data: { lib: "draft", prefix: PRF, cmd: "teamget", guid: guid, team: team }, dataType: "json", cache: false, error: a$.ajaxerror,
                        success: teamgot2
                    });
                    function teamgot2(json) {
                        if (a$.jsonerror(json)) {
                        }
                        else {
                            if (json.members.length > 0) {
                                draftteams[team] = []; //safest.
                                for (var i in json.members) {
                                    draftteams[team].push({ uid: json.members[i].uid, pick: json.members[i].draft.pick });
                                }
                                showteamtable(team, teamname);
                            }
                        }
                    }
                }
                function showteamtable(team, teamname) {
                    $(".draft-team-table-body").html("");
                    for (var i in drafttable) {
                        for (var j in draftteams[team]) {
                            if (drafttable[i].uid == draftteams[team][j].uid) {
                                var bld = '<tr><td style="display:none;">' + drafttable[i].uid + '</td><td>' + draftteams[team][j].pick + '</td><td>' + drafttable[i].name + '</td><td>' + drafttable[i].project + '</td><td>' + drafttable[i].location + '</td><td>' + drafttable[i].team + '</td><td class="centered">' + drafttable[i].scores[0].score.toFixed(1) + '</td><td class="centered">' + drafttable[i].scores[1].score.toFixed(1) + '</td><tr>';
                                $(".draft-team-table-body").append(bld);
                                //alert("debug: showing: " + bld);
                                break;
                            }
                        }
                    }
                    $(".draft-team-table-tablesorter").eq(0).trigger("update");
                    $(".draft-table-pane").hide();
                    $(".draft-team-table-header label").html("Team Selection for " + teamname);
                    $(".draft-team-table-pane").show();
                }
            });
        }

        function uiDraftPlayer(i, pick) {
            var uid = drafttable[i].uid;
            //var bld = '<tr><td style="display:none;">' + drafttable[i].uid + '</td><td>' + ($(".draft-table-drafted-body").children().length + 1) + '</td><td>' + drafttable[i].name + '</td><td>' + drafttable[i].team + '</td></tr>'; //<td class="centered">' + drafttable[i].scores[0].score.toFixed(1) + '</td><td class="centered">' + drafttable[i].scores[1].score.toFixed(1) + '</td><td class="centered">' + drafttable[i].scores[2].score.toFixed(1) + '</td></tr>';
            var bld = '<tr><td style="display:none;">' + drafttable[i].uid + '</td><td>' + pick + '</td><td>' + drafttable[i].name + '</td><td>' + drafttable[i].team + '</td></tr>'; //<td class="centered">' + drafttable[i].scores[0].score.toFixed(1) + '</td><td class="centered">' + drafttable[i].scores[1].score.toFixed(1) + '</td><td class="centered">' + drafttable[i].scores[2].score.toFixed(1) + '</td></tr>';
            //TODO: Make this the "Pick", which is the order of picking.  1st, 2nd, 3rd, etc.
            $(".draft-table-drafted-body").append(bld);
            $(".draft-table-drafted-tablesorter").eq(0).trigger("update");
            $(".draft-detail-prompt").hide();
            $(".draft-detail").html("");
            $(".draft-detail-buttons").hide();
            $(".draft-table-body tr").each(function () {
                var tuid = $(" td", this).eq(0).html();
                if (tuid == uid) {
                    //$(this).remove(); //hiding now
                    $(this).hide();
                }
            });
            $(".draft-table-q-body tr").each(function () {
                var tuid = $(" td", this).eq(0).html();
                if (tuid == uid) {
                    $(this).remove();
                }
            });
            uiddetail = "";
        }

        function showcountdown() {
            var d = new Date();
            var c = new Date(begintime.getTime() - d.getTime());

            if (draftstarted) { //Received from server.
                c = 0;
            }
            if (draftfinished) {
                //Note: the countdown will stop.
                if (oMock()) $(".draft-reset").show();
                $(".draft-table-menu-teams").removeClass("menu-disabled");
                $(".draft-table-menu-teams").unbind().bind("click", function () {
                    $(".draft-table-pane").hide();
                    $(".draft-team-table-pane").show();
                });

            }
            else {
                if ((c <= 0) && (chateesloaded || draftstarted)) {
                    oCountdown("0");
                    if (!draftstartrendered) {
                        //TODO: Start Draft.
                        $(".draft-er-move").unbind().html("");
                        $(".draft-er-move").addClass("draft-er-image");
                        $(".draft-er-move").removeClass("draft-er-move");
                        $(".draft-table-menu-teams").removeClass("menu-disabled");
                        $(".draft-table-menu-teams").unbind().bind("click", function () {
                            $(".draft-table-pane").hide();
                            $(".draft-team-table-pane").show();
                        });

                        //alert("debug: got here 1"); //,.draft-er-name,.draft-er-order
                        //TODO: This doesn't work and I don't know why.  If I start fresh sometimes it does.
                        $(".draft-er-image.draft-er-name,.draft-er-order").unbind().css("cursor", "pointer").bind("click", function () {
                            var team = $(" .draft-er-order", $(this).parent()).eq(0).html();
                            alert("debug: show team for team # " + team);
                        });

                        $(".draft-select-observe").hide();
                        //oPrompt("Draft Starting...<br />You are in position: " + mydraftposition + " of " + oTeamCount());
                        //oPrompt("Draft Starting<br />Setting up server...");
                        //$(".draft-desc-prompt").css("backgroundColor", "darkgreen").css("fontWeight", "bold").css("color", "white");
                        oPrompt("");
                        $(".draft-desc-prompt").css("backgroundColor", "").css("fontWeight", "").css("color", "");
                        oPending(true);
                        if (oMock()) $(".draft-reset").show();
                        for (var i = 0; i <= oTeamCount(); i++) { //Leave this 1-based, the 0 will be unused.
                            draftteams[i] = [];
                        }
                        draftfinishedrendered = false; //Seems like the safest place to put this.
                    }
                    draftstartrendered = true;
                }
                else {
                    if (c < (10 * 1000)) { //10 second warning track.
                        draftwarning = true;
                        $(".draft-er-move").html("");
                        $(".draft-er-move").addClass("draft-er-image");
                        $(".draft-er-move").removeClass("draft-er-move");
                        oPrompt("Draft Position Locking...<br />(Draft Starting Shortly)");
                        $(".draft-desc-prompt").css("backgroundColor", "yellow").css("fontWeight", "bold").css("color", "black");
                    }
                    oCountdown(((Math.floor(c / 60000))).padLeft(2, '0') + ":" + ((Math.floor(c / 1000) % 60)).padLeft(2, '0'));
                    $('.draft-opp-wrapper').scrollTop(0);
                    draftTimeout = setTimeout(showcountdown, 1000);
                }
            }
        }
        function showoppcountdown() {
            var d = new Date();
            var c = new Date(1000 + opppickendtime.getTime() - d.getTime()); //Add a second to make it look right.
            var bld = "";

            if (paused) {
                bld = "PAUSED";
                oppTimeout = setTimeout(showoppcountdown, 1000);
            }
            else {
                if (c > 0) {
                    bld = ":" + ((Math.floor(c / 1000) % 60)).padLeft(2, '0');
                    oppTimeout = setTimeout(showoppcountdown, 1000);
                }
                else {
                    bld = ":00";
                }
            }
            $(" td", $(".draft-opp-table-body tr").eq(curpick - 1)).eq(3).html(bld);
        }
        function showfinishcountdown() {
            if (draftroomclosetime == null) {
                finishTimeout = setTimeout(showfinishcountdown, 1000);
            }
            else {
                var now = new Date();
                var t = draftroomclosetime.getTime() - now.getTime();
                if (t <= 0) {
                    stopping = true;
                    draftfinishedrendered = true;
                    $(".draft-desc-closetime span").html("CLOSED");
                    //alert("debug: Draft room closed (will be re-directing or displaying a final overlay screen).");
                    finaldisplay();
                }
                else {
                    var ts = "" + Math.floor(t / 60000).padLeft(2, '0') + ":" + ((Math.floor(t / 1000) % 60)).padLeft(2, '0');
                    $(".draft-desc-closetime span").html(ts);
                    finishTimeout = setTimeout(showfinishcountdown, 1000);
                }
            }
        }

        function bindreset() {
            $(".draft-reset").unbind().bind("click", function () {
                a$.ajax({
                    type: "GET" /*POST*/, service: "JScript", async: true, data: { lib: "draft", prefix: PRF, cmd: "draftingreset", guid: guid }, dataType: "json", cache: false, error: a$.ajaxerror,
                    success: draftingreseted
                });
                function draftingreseted(json) {
                    if (a$.jsonerror(json)) {
                    }
                }
            });
        }
        bindreset();
    }

    function activateQ() {
        $(".draft-table-q-body tr").hover(function () {
            $(" td", this).css("background-color", "yellow");

        }, function () {
            var uid = $(" td", $(this)).eq(0).html();
            $(" td", this).css("background-color", "");
            if (uid == uiddetail) {
                $(" td", this).addClass("draft-detail-highlight");
            }
        });

        $(".draft-table-q-body td").unbind().bind("click", function () {
            var uid = $(" td", $(this).parent()).eq(0).html();
            $(".draft-table-q-body tr td").removeClass("draft-detail-highlight");
            $(".draft-table-body tr td").removeClass("draft-detail-highlight");
            $(" td", $(this).parent()).addClass("draft-detail-highlight");
            $(".draft-table-body td").each(function () {
                var tuid = $(" td", $(this).parent()).eq(0).html();
                if (tuid == uid) {
                    $(" td", $(this).parent()).addClass("draft-detail-highlight");
                }
            });
            $(".draft-detail-buttons").hide();
            for (var i in drafttable) {
                if (drafttable[i].uid == uid) {
                    bld = '<span class="draft-selected-uid">' + uid + '</span>';
                    bld += 'Name:&nbsp;' + drafttable[i].name + '<br />';
                    bld += 'Team:&nbsp;' + drafttable[i].team + '<br />';
                    bld += 'Hire Date:&nbsp;'/* + drafttable[i].team */ + '<br />';
                    $(".draft-detail-prompt").hide();
                    $(".draft-detail").html(bld);
                    $(".draft-detail-button-q").hide();
                    $(".draft-detail-buttons").show();
                    uiddetail = uid;
                    break;
                }
            }
        });

        $(".draft-q-remove").unbind().bind("click", function () {
            var uid = $(" td", $(this).parent()).eq(0).html();
            $(this).parent().remove();
            if (uid == uiddetail) {
                $(".draft-detail-button-q").show();
            }
            showhideArrows();
        });

        $(".draft-q-up").unbind().bind("click", function () {
            var myindex = $(this).parent().index();
            if (myindex > 0) {
                $(this).parent().swapWith($(this).parent().parent().children().eq(myindex - 1));
            }
            showhideArrows();
        });

        $(".draft-q-down").unbind().bind("click", function () {
            var myindex = $(this).parent().index();
            if (myindex < ($(this).parent().parent().children().length - 1)) {
                $(this).parent().swapWith($(this).parent().parent().children().eq(myindex + 1));
            }
            showhideArrows();
            /*
            var uid = $(" td", $(this).parent()).eq(0).html();
            $(this).parent().remove();
            if (uid == uiddetail) {
            $(".draft-detail-button-q").show();
            }
            */
        });

        showhideArrows();

        function showhideArrows() {
            var bottomidx = $(".draft-table-q-body tr").length - 1;
            var cnt = 0;
            $(".draft-table-q-body tr").each(function () {
                $(".draft-q-up", this).html("&uarr;");
                $(".draft-q-down", this).html("&darr;");
                if (cnt == 0) {
                    $(".draft-q-up", this).html("");
                }
                if (cnt == bottomidx) {
                    $(".draft-q-down", this).html("");
                }
                cnt += 1;
            });
            if (bottomidx > 0) {
                $(".draft-q-save").show();
            }
            else {
                $(".draft-q-save").hide();
            }
            $(".draft-q-saved").hide();
        }

        jQuery.fn.swapWith = function (to) {
            return this.each(function () {
                var copy_to = $(to).clone(true);
                var copy_from = $(this).clone(true);
                $(to).replaceWith(copy_from);
                $(this).replaceWith(copy_to);
            });
        };
    }

    function unwelcome(prompt) {
        $(".draft-wrapper").hide();
        $(".unwelcome-prompt").html(prompt);
        $(".unwelcome-wrapper").show();
    }
    if (a$.gup("league") == "") {
        unwelcome("Must pass league id");
        return;
    }
    var leagueid = 0;
    if (isNumeric(a$.gup("league"))) {
        leagueid = parseInt(a$.gup("league"),10);
    }
    else {
        unwelcome("League ID must be numeric.");
        return;
    }

    function finaldisplay() {
        a$.ajax({
            type: "GET", service: "JScript", async: true, data: { lib: "draft", prefix: PRF, cmd: "teamget", guid: guid, teamuid: oUid() }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: teamgot
        });
        function teamgot(json) {
            if (a$.jsonerror(json)) {
            }
            else {
                $(".final-team-table-body").html("");
                if (json.members.length > 0) {
                    for (var i in drafttable) {
                        for (var j in json.members) {
                            if (drafttable[i].uid == json.members[j].uid) {
                                var bld = '<tr><td style="display:none;">' + drafttable[i].uid + '</td><td>' + json.members[j].draft.pick + '</td><td>' + drafttable[i].name + '</td><td>' + drafttable[i].project + '</td><td>' + drafttable[i].location + '</td><td>' + drafttable[i].team + '</td><td class="centered">' + drafttable[i].scores[0].score.toFixed(1) + '</td><td class="centered">' + drafttable[i].scores[1].score.toFixed(1) + '</td><tr>';
                                $(".final-team-table-body").append(bld);
                                break;
                            }
                        }
                    }
                    $(".final-team-table-tablesorter").eq(0).trigger("update");
                }
            }
        }
        $(".draft-wrapper").hide();
        $(".final-wrapper").show();
    }

    a$.ajax({        
        type: "GET" /*POST*/, service: "JScript", async: true, data: { lib: "draft", cmd: "register", leagueid: leagueid }, dataType: "json", cache: false, error: a$.ajaxerror,
        success: registering
    });
    function registering(json) {
        if (!json.registered) {
            unwelcome("Registration Failure: " + json.reason);
        }
        else {
            oMock(json.mock);
            oLeagueName(json.leaguename);
            PRF = json.prefix; //Send with ALL other calls to allow routing to the correct draft room.
            ping();
        }
    }

    Number.prototype.padLeft = function (n,str) {
        return Array(n-String(this).length+1).join(str||'0')+this;
    }
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }


    window.draft = {
        ping: ping
    };

}
