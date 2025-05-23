/************
appApmMessaging - Messaging App
1.2.10 - Add Sending blanket messages to a location.
1.2.11 - Launch a window on chat beep
1.2.12 - Change "getchatees" to occur much less frequently, and also asynchronously.
1.2.14 - Change Posts to Gets (for debugging).
1.2.15 - Created some control over the client browser through the PINGCHAT.
1.2.16 - Added an eval function to the pingchat, to enable client-side code to be pushed over in emergencies.
1.3.0 - Implement PAGED MESSAGING.  New request - GetMessagesPage, with a member "label".  The getmessage command has a new member of getfirstspage = true.
             Only the "Inbox" label will retrieve the top 50 in this case.  There's a "count date"
1.4.4 - First release of team-centered chat.
************/

(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;
    var isvideohome = false;

    var NOBODYSELECTED = false;

    var A = []; //For easy local storage of arrays with eval functions.
    var O = {}; //For easy local storage of an object with eval functions.
    var MANAGELEVEL = 5;

    var chatindex = 0;

    var chat20ui = false;

    var chatlog = [];

    var videopool = [];

    var numsessions = 1;

    var lastchatees = {};

    var LOADCOUNT = 100;

    var LASTMSGID = 0;
    var MESSAGEPOLLDELAY = 1000 * 60; //ONE MINUTE now.

    var LONGPOLLERINTERVAL = 500; //Every half second
    var LONGPOLLEROVERRIDE = false; //Keeps short polling timeouts from being repeatedly set.

    //Added 2020-12-12 - Poll rapidly for KM2 (long polling coming soon).
    if (a$.urlprefix() == "km2.") {
        var MESSAGEPOLLDELAY = 1000 * 20; //20 Seconds
    }

    var OUTOFCHATDELAY = 1000 * 15; //10 seconds
    var INCHATDELAY = 1000 * 3; //3 seconds
    var CHATPINGDELAY = OUTOFCHATDELAY;

    var CHATIDLETIMEOUT = 1000 * 30; //60 seconds
    var chatlasttouch;
    var lastchatix = 0;

    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    var lastchatlifesign = 0;
    var chatmessagespending = false;
    var CHATLIFETIMEOUT = 1000 * 15; //15 seconds

    var Team = "";
    var Role = "";

    function affirmTeamLinkDisplay() {
        //if ($.cookie("TP1Role") != "Admin") return; //debug
        if (Role == "CSR") {
            $(".chat-plus-team").hide();
            $(".chat-window").removeClass("expanded");
        }
        else {
            if ((Team != "") && (Team != "each")) {
                $(".chat-plus-team").show();
            }
            else {
                $(".chat-plus-team").hide();
                $(".chat-window").removeClass("expanded");
            }
        }
    }

    ko.postbox.subscribe("Team", function (newValue) {
        Team = newValue;
        affirmTeamLinkDisplay();
    });

    ko.postbox.subscribe("Role", function (newValue) {
        Role = newValue;
        affirmTeamLinkDisplay();
    });

    var lastchattimestamp = 0;
    var CHATTIMESTAMPTIMEOUT = 1000 * 15; //15 seconds (change to 5 minutes).

    var lastadd = 0;
    var CHATLOOPROUNDS = 5; //Every 5 rounds, get chatees.
    var chatloopcount = 10;

    var blurring = false;

    var msg;

    var pollingsuspended = false;
    var pollsuspensiontimestamp = 0;
    var POLLSUSPENSIONDELAY = 1000 * 60 * 1; //1 minutes

    //fail-safe
    var CHATPINGTESTINTERVAL = 1000 * 30; //30 seconds
    var CHATPINGTIMEOUT = 1000 * 60; //60 seconds

    var MESSAGEPOLLTESTINTERVAL = 3000 * 60; //3 MINUTES
    var MESSAGEPOLLTIMEOUT = 5000 * 60; //FIVE MINUTES.
    var lastpingtimestamp = 0;
    var lastpolltimestamp = 0;

    function pollfailsafe() {
        var rn = (new Date).getTime();
        setTimeout('appApmMessaging.pollfailsafe()', MESSAGEPOLLTESTINTERVAL);
        if ((rn - lastpolltimestamp) > MESSAGEPOLLTIMEOUT) {
            pollmessages();
        }
    }

    function pingfailsafe() {
        //alert("debug: ping failsafe called");
        var rn = (new Date).getTime();
        setTimeout('appApmMessaging.pingfailsafe()', CHATPINGTESTINTERVAL);
        if ((rn - lastpingtimestamp) > CHATPINGTIMEOUT) {
            //alert("debug: ping failsafe fired");
            $(".chat-send").show();
            $(".poll-suspend").hide();
            pollingsuspended = false;

            // TRAPPING
            if (!$(".err-icon").first().is(":visible")) {
                $(".err-container").hide();
            }

            pingchat();
        }
    }

    function suspendpolling(strsecs) {
        var secs = parseInt(strsecs);
        //TODO: Make this submit to the chat server for pick-up.
        pollsuspensiontimestamp = (new Date).getTime();
        POLLSUSPENSIONDELAY = secs * 1000;
        pollingsuspended = true;
        $(".chat-send").hide();
        var mins = Math.floor(secs / 60);
        secs -= mins * 60;
        $(".poll-suspend").html("Chat/Messages Suspended for " + mins + ":" + secs).show();
    };

    function issuepollingsuspension(secs) {
        a$.ajax({ //Changed 2018-12-07
            type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "chat", cmd: "suspendchat", time: secs, guid: guid }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: loaded
        });
        function loaded(json) {
            if (a$.jsonerror(json)) {
            }
        }
    }

    function testerror() {
        a$.ajax({
            type: "GET" /*POST*/, service: "JScript", async: true, data: { lib: "utility", cmd: "throw" }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: loaded
        });
        function loaded(json) {
            if (a$.jsonerror(json)) {
            }
        }
    }

    function loadnextpage() {
        var lab = "NOTFOUND";
        if (false) { //UPDATED: 2015-11-12 - Remove this part, it's causing it to refresh when composing a message.
            $("a.messages-box-active span").first().each(function () {
                lab = $(this).html();
            });
        }
        if (lab == "NOTFOUND") {
            //Try again from the actual message box title.
            $(".message-boxtitle").first().each(function () {
                lab = $(this).html();
            });
        }
        if (lab == "NOTFOUND") {
            //UPDATED: 2015-11-12 alert("debug: label not found");
        }
        else {
            var ed = "UNKNOWN";
            var ec = "UNKNOWN";
            var idlab = 0;
            for (var k in msg.labels) {
                if (msg.labels[k].name == lab) {
                    ed = msg.labels[k].earliestdate;
                    ec = msg.labels[k].endconfirmed;
                    idlab = msg.labels[k].id;
                }
            }
            //alert("debug:Calling to get next page for label: " + lab + ", with earliestdate: " + ed + ", endconfirmed:" + ec);
            if (ec == "N") {
                var databld = { cmd: "GetMessagesPage", idlab: idlab, label: lab, count: LOADCOUNT, earliestdate: ed, idusr: msg.idusr, howalerts: appLib.gup("showalerts") };
                a$.showprogress("messageprogress");
                a$.ajax({
                    type: "GET", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
                    success: loaded
                });

                function loaded(json) {
                    a$.hideprogress("messageprogress");
                    if (a$.jsonerror(json)) {
                    }
                    else {
                        //Find the existing label and update the earliestdate and endconfirmed
                        for (var k in msg.labels) {
                            if (msg.labels[k].id == json.idlab) {
                                msg.labels[k].earliestdate = json.earliestdate;
                                msg.labels[k].endconfirmed = json.endconfirmed;
                                break;
                            }
                        }
                        //Add the messages to the end of the message list.
                        msg.messages.push.apply(msg.messages, json.messages); //Hm, I wonder if this works.
                        setmsglastid();
                        showmessagelist(json.label);
                        showmessagebox(json.label); //TODO: If not first messages, this will likely reset the scroll.  Deal with this.
                    }
                }
            }
        }
    }
    function getmessages() {
        /*
        if (((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) && ($.cookie("TP1Role") == "CSR")) {
        //$("#messagetab").remove();
        $(".headericon-chat").remove();
        $(".headericon-message").remove();
        return;
        }
        */
        setTimeout('appApmMessaging.pingfailsafe()', CHATPINGTESTINTERVAL);
        pingchat();
        var databld = { cmd: "getmessages", seedinbox: LOADCOUNT, showalerts: appLib.gup("showalerts") /* , username: $.cookie("TP1Username") */ };
        a$.showprogress("messageprogress");
        a$.ajax({
            type: "GET", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
            success: loaded
        });

        function loaded(json) {
            a$.hideprogress("messageprogress");
            if (a$.jsonerror(json)) {
            }
            else {
                msg = json;
                for (var k in msg.labels) {
                    if (exists(msg.labels[k].totalunreadstring)) {
                        msg.labels[k].totalunread = parseInt(msg.labels[k].totalunreadstring);
                    }
                }
                var d = new Date();
                var st = new Date(json.clock);

                appLib.settimediff(d.getTime() - st.getTime());

                var tot = showmessagelist("");
                if ((tot.unread > 0) || (tot.incomplete > 0)) {
                    var bld = "You have ";
                    if (tot.unread > 0) {
                        bld += tot.unread + " unread message";
                        if (tot.unread > 1) bld += "s";
                        if (tot.incomplete > 0) bld += " and<br />";
                    }
                    if (tot.incomplete > 0) {
                        bld += tot.incomplete + " incomplete assignment";
                        if (tot.incomplete > 1) bld += "s";
                        bld += ".";
                    }
                    else bld += ".";
                    switch ($("#StgNotifications select").val()) {
                        case "Alert":
                            alert(bld);
                            break;
                        case "Banner":
                            $(".messages-alert-newmessages").children().first().html(bld);
                            $(".messages-alert-newmessages").show();
                            setTimeout('$(".messages-alert-newmessages").hide();', 1000 * 10);
                    }
                }

                setmsglastid();
                lastpolltimestamp = (new Date).getTime(); //Must seed because of the timed first useage.

                if ((a$.urlprefix(true) == "mnt.") && (a$.urlprefix() != "chime.")) { //Leave CHIME as a SHORT-POLLING escape
                    var MESSAGEPOLLDELAY = 1000 * 60 * 10000; //Forever (affectively disabled)
                    var MESSAGEPOLLTESTINTERVAL = 3000 * 60 * 10000; //Forever (affectively disabled)
                    var MESSAGEPOLLTIMEOUT = 5000 * 60 * 10000; //Forever (affectively disabled)

                    LONGPOLLEROVERRIDE = true;
                    //$(".poller-debug").show();
                    $(".longpoller-active").show();
                    $("#poller_client").html(msg.idclient);
                    $("#poller_userid").html($.cookie("TP1Username")); 
                    $("#poller_idusr").html(msg.idusr);
                    $("#poller_idlastmsg").html(LASTMSGID);
                    $("#poller_message_com").html("READY");
                    setTimeout('appApmMessaging.longpoller()', LONGPOLLERINTERVAL);
                }

                if (!LONGPOLLEROVERRIDE) {
                    setTimeout('appApmMessaging.pollfailsafe()', MESSAGEPOLLTESTINTERVAL);
                    setTimeout('appApmMessaging.pollmessages()', MESSAGEPOLLDELAY);
                }
            }

            $(".messages-compose input").bind("click", function () {
                $('#messagetab').show();
                $('#messageslabel').trigger('click');
                var bld = '<div class="message-compose">';
                bld += '<span class="message-compose-caption">Compose Message</span>';
                bld += '</div>'
                bld += '<div style="float:left;">';
                bld += '  <div style="margin-bottom: 10px;float:left;">';
                bld += '    To:&nbsp;';
                bld += '  </div>';
                bld += '  <div class="message-to-manual">';
                bld += '    <select id="composeto" style="width:500px;" data-placeholder="Click Here to Select Recipients." class="message-compose-to" multiple><option value=""></option></select>';
                bld += '  <div class="message-fine-print">Change the Dashboard Filter for More Choices.</div></div>';
                //Ths (message-to-auto) isn't used currently but keeping.
                //bld += '  <div class="message-to-auto-wrapper" style="display:none;clear: left;"><div style="margin-top: 10px;float:left;">Selected:&nbsp;</div><div class="message-to-auto" style="margin-top: 10px;float:left;border: 1px solid gray; width: 400px; height: 100px;"></div></div>';
                bld += '</div>';
                bld += '<div style="clear:both;"><div class="message-compose-subject"><span>Subject:</span> <input type="text" id="composesubject" /></div></div>';
                //MOD 10/14/2015
                //WAS:
                //bld += '<div><textarea type="text" id="composebody" class="message-compose-body"/></textarea></div>';
                //IS:
                bld += '<div class="message-compose-message">Message: <div id="composebody" contenteditable="true" class="message-div-compose-body"/></textarea></div>';

                bld += '<div class="message-compose-send" style="float: left;"><input type="button" value="Send Message"/>';
                bld += '</div>';
                $('#messagearea').html(bld);

                //$("#composeto").find("option").remove().end().append($('<option></option>').val("").html("Select Recipients"));
                //$("#composeto").val("");
                $("#composesubject").bind("keyup", function () {
                    msgchecksend();
                }).bind("paste", function () {
                });
                $("#composebody").bind("keyup", function () {
                    msgchecksend();
                }).bind("paste", function (e) {
                    setTimeout(function () {
                        function clearUnsupported(obj) {
                            $(obj).children().each(function () {
                                clearUnsupported($(this));
                                $(this).removeAttr("class");
                                $(this).removeAttr("style");
                                $(this).removeAttr("align");
                            });
                        }
                        clearUnsupported($(e.currentTarget));

                        //Emulate final build.
                        var bld = $.trim($(e.currentTarget).html());
                        bld = bld.replace(/&nbsp;/g, " ");
                        bld = bld.replace(/\t/g, '  ').replace(/\\/g, "|");
                        bld = bld.replace(/<div>/g, "");
                        bld = bld.replace(/<\/div>/g, "<br>");

                        $(e.currentTarget).html(bld);
                        //TESTREMOVE: if (bld.length > 3990) {
                        //TESTREMOVE:     alert("Message is too long and will be cut off");
                        //TESTREMOVE: }

                        /*
                        $(e.currentTarget).html($(e.currentTarget).html().replace(/style\s*=\s*('|")[^\1]*\1/g, ""))
                        $(e.currentTarget).html($(e.currentTarget).html().replace(/class\s*=\s*('|")[^\1]*\1/g, ""))
                        $(e.currentTarget).html($(e.currentTarget).html().replace(/align\s*=\s*('|")[^\1]*\1/g, ""))
                        */
                    }, 0);
                    /*
                    var pastedData = e.originalEvent.clipboardData.getData('text');
                    alert("debug:paste=" + pastedData);
                    $(this).trigger("change");
                    */
                }).bind("change", function () {
                    alert("debug:change");
                    //$(this).html($(this).html().replace(/style\s*=\s*('|")[^\1]*\1/g, ""));
                    var rs = $(this).html();
                    rs = rs.replace(/style/g, "whatis");
                    $(this).html(rs);
                });

                $(".message-compose-send").bind("click", function () {
                    $(".message-compose-send").hide(); //Added 9/28/2015
                    var tostr = "";
                    $("#composeto option:selected").each(function () {
                        if (tostr != "") tostr += "~";
                        tostr += $(this).text() + "|" + $(this).val();
                    });

                    //MOD 10/14/2015
                    //WAS:
                    //var bld = $.trim($("#composebody").html());
                    //IS:
                    var bld = $.trim($("#composebody").html());

                    bld = bld.replace(/&nbsp;/g, " ");
                    bld = bld.replace(/\t/g, '  ').replace(/\\/g, "|");
                    bld = bld.replace(/<div>/g, "");
                    bld = bld.replace(/<\/div>/g, "<br>");
                    //TESTREMOVE: if (bld.length > 3990) {
                    //TESTREMOVE: bld = bld.substring(0, 3990) + "...";
                    //TESTREMOVE: }
                    value = bld;
                    var subject = $.trim($("#composesubject").val());
                    subject = subject.replace(/\t/g, '  ').replace(/\\/g, "|");

                    //ADDED: 2015-11-04
                    var reLF = new RegExp(String.fromCharCode(13), "g");
                    subject = subject.replace(reLF, ''); //line feeds cause dumps.
                    value = value.replace(reLF, ''); //line feeds cause dumps.
                    var reCR = new RegExp(String.fromCharCode(10), "g");
                    subject = subject.replace(reCR, ''); //carriage return also causes dumps.
                    value = value.replace(reCR, ''); //carriage return also causes dumps.

                    window.mysubject = subject;
                    window.mybody = value;

                    a$.ajax({
                        type: "POST", async: true, data: { cmd: "messagesend", to: tostr, read: "Y", subject: subject, body: value }, dataType: "json", cache: false, error: a$.ajaxerror,
                        success: loaded
                    });
                    function loaded(json) {
                        if (a$.jsonerror(json)) {
                        }
                        else {
                            // DONE: 2016-01-19 - Add test for sent messages having been retrieved already.
                            var labid = getlabid("Sent Messages");
                            var foundsent = false;
                            for (var i in msg.messages) {
                                for (var j in msg.messages[i].labels) {
                                    if (msg.messages[i].labels[j].id == labid) {
                                        foundsent = true;
                                        break;
                                    }
                                }
                                if (foundsent) break;
                            }

                            if (foundsent) {
                                var m = new Object();
                                m.id = json.id;
                                m.from = "";
                                m.to = tostr;
                                m.subject = window.mysubject;
                                m.body = window.mybody;
                                m.date = "Pending..";
                                m.read = "Y";
                                m.labels = new Array();
                                msg.messages.splice(0, 0, m);
                                messageaddlabel(0, "Sent Messages");
                            }
                            else {
                                a$.ajax({
                                    type: "GET", async: true, data: { cmd: "messagelabels", subcmd: "add", messageid: json.id, labelid: labid }, dataType: "json", cache: false, error: a$.ajaxerror
                                });
                            }

                            showmessagelist("");
                            //REMOVED 2020-07-28
                            //$('#messagetab').show();
                            //$('#graphlabel').trigger('click');
                            switch ($("#StgNotifications select").val()) {
                                case "Alert":
                                    alert("Message sent.");
                                    break;
                                case "Banner":
                                    $(".messages-alert-messagesent").children().first().html("Message Sent");
                                    $(".messages-alert-messagesent").show();
                                    setTimeout('$(".messages-alert-messagesent").hide();', 1000 * 4);
                            }
                            //Added 2020-12-12 - Force a poll refresh immediately after a message is confirmed as sent.
                            //Added 2021-01-24 - Don't do this if long-polling.
                            if (!LONGPOLLEROVERRIDE) {
                                lastpolltimestamp = 0;
                                pollmessages();
                            }
                        }
                    };
                    //Added 2020-07-28 as a bandaid.
                    $(".messages-compose input").trigger("click");
                    $('#messagetab').show();
                    $('#graphlabel').trigger('click');
                });
                composecontacts();
            });
            showmessagebox("Inbox", true);
        }
        initchatwindow();
    }

    function setmsglastid() {
        for (var i in msg.messages) {
            if (parseInt(msg.messages[i].id) > LASTMSGID) {
                LASTMSGID = parseInt(msg.messages[i].id);
            }
        }
        $("#poller_idlastmsg").html(LASTMSGID);
    }

    function longpoller() {
        if ($("#poller_message_com").html() == "true") {
            if ($("#poller_message_com_alert").is(':checked')) {
                alert("poller_message_com returned true");
            }
            pollmessages();
        }
        else {
            setTimeout('appApmMessaging.longpoller()', LONGPOLLERINTERVAL);
        }
    }

    function pollmessages() {
        // TRAPPING
        if (!$(".err-icon").first().is(":visible")) {
            $(".err-container").hide();
        }

        if (!LONGPOLLEROVERRIDE) {
            var rn = (new Date).getTime();
            if ((rn - lastpolltimestamp) < MESSAGEPOLLDELAY) return; //Keeps from fail-safe multi-looping.
        }

        lastpolltimestamp = rn;
        var online = navigator.onLine;
        if ((!online) || pollingsuspended) {
            if (!LONGPOLLEROVERRIDE) {
                setTimeout('appApmMessaging.pollmessages()', MESSAGEPOLLDELAY);
                return;
            }
        }
        //$(".chat-area").append("debug:When in the course of human events it becomes necessary for a nation to break the ties that bind it to another, the laws of decency compels it to tell them why they no longer wish to be under tyranny.");
        var databld = { cmd: "GetNewMessages", showalerts: appLib.gup("showalerts"), idusr: msg.idusr, lastid: LASTMSGID };
        a$.ajax({
            type: "GET", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
            success: loaded
        });
        function loaded(json) {
            if (a$.jsonerror(json)) {
            }
            else {
                if (json.messages.length > 0) {
                    var hasinbox = false;
                    // hasinbox?
                    //Update 2020-12-12 - Remove all with date of "Pending.."
                    for (var s = msg.messages.length - 1; s >= 0; s--) {
                        if (a$.exists(msg.messages[s].date)) {
                            if (msg.messages[s].date == "Pending..") {
                                msg.messages.splice(s, 1);
                            }
                        }
                    }
                    for (var i in json.messages) {
                        //CHANGE 2015-11-03 for 1.3 - Instead of putting it on the end, splice it to the beginning.
                        //WAS:msg.messages[msg.messages.length] = json.messages[i];
                        msg.messages.splice(0, 0, json.messages[i]);

                        for (var j in json.messages[i].labels) {
                            if (json.messages[i].labels[j].name == "Inbox") {
                                hasinbox = true;
                                for (var k in msg.labels) {
                                    if (msg.labels[k].name == "Inbox") {
                                        msg.labels[k].totalunread += 1;
                                        break;
                                    }
                                }
                            }
                            else {
                                //See if the label is already in here.
                                var haslabel = false;
                                for (var k in msg.labels) {
                                    if (msg.labels[k].name == json.messages[i].labels[j].name) {
                                        haslabel = true;
                                        break;
                                    }
                                }
                                if (!haslabel) {
                                    msg.labels.push({ id: json.messages[i].labels[j].id, name: json.messages[i].labels[j].name });
                                }
                                showmessagelist("");
                                $(".message-boxtitle").each(function () {
                                    if ($(this).html() == json.messages[i].labels[j].name) {
                                        showmessagebox(json.messages[i].labels[j].name, true);
                                    }
                                });
                            }
                        }
                    }
                    setmsglastid();
                    if (hasinbox) {
                        showmessagelist("");
                        $(".message-boxtitle").each(function () {
                            if ($(this).html() == "Inbox") {
                                showmessagebox("Inbox", true);
                            }
                        });

                        if (document.getElementById("StgNotifications") != null) {
                            switch ($("#StgNotifications select").val()) {
                                case "Alert":
                                    alert("You have received a new message.");
                                    break;
                                case "Banner":
                                    $(".messages-alert-messagereceived").children().first().html("New Message Received");
                                    $(".messages-alert-messagereceived").show();
                            }
                        }
                    }
                }
                if (!LONGPOLLEROVERRIDE) {
                    setTimeout('appApmMessaging.pollmessages()', MESSAGEPOLLDELAY);
                }
                else {
                    $("#poller_message_com").html("READY");
                    setTimeout('appApmMessaging.longpoller()', LONGPOLLERINTERVAL);
                }
            }
        }
    }

    function msgchecksend() {
        var en = true;
        if ($("#composeto").val() == null) en = false;
        if ($("#composesubject").val() == null) en = false;
        if ($.trim($("#composesubject").val()) == "") en = false;
        if ($("#composebody").html() == null) en = false;
        if ($.trim($("#composebody").html()) == "") en = false;
        $(".message-compose-send").each(function () {

            //TODO: This is defeated temporarily (it doesn't work with IE 8 or 9)
            en = true;

            if (en) $(this).removeAttr("disabled");
            else $(this).attr("disabled", "disabled");
        });
    }

    function composecontacts() {
        if (document.getElementById("composeto") == null) return;
        /*
        if (((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) && ($.cookie("TP1Role") == "CSR")) {
        return;
        }
        */

        var sv = new Array();
        $("#composeto option:selected").each(function () {
            var op = new Object;
            op.text = $(this).text();
            op.val = $(this).val();
            sv[sv.length] = op;
        });

        $("#composeto").find("optgroup").remove();
        $("#composeto").find("option").remove();
        var issub = (($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "CSR"));
        issub = false; //CHANGE 2013-03-19
        if (issub) { //Old way - only let them see their own supervisor
            $("#composeto").append($('<optgroup label="SUPERVISORS"></optgroup>'));
            if (msg.contacts.supervisors) {
                for (var i in msg.contacts.supervisors) {
                    $("#composeto").children().last().append($('<option></option>').val(msg.contacts.supervisors[i].username).html(msg.contacts.supervisors[i].name.replace(/'/g, '')));
                }
            }
        }
        if ($.cookie("TP1Role") != "CSR") {
            $("#composeto").append($('<optgroup label="GROUPS and TEAMS"></optgroup>'));
            loadtooptions($("#composeto").children().last(), 'selGroups', 'Entire Group: ', '');
            loadtooptions($("#composeto").children().last(), 'selTeams', 'Entire Team: ', '');
        }
        $("#composeto").append($('<optgroup label="CSRs"></optgroup>'));
        loadtooptions($("#composeto").children().last(), 'selCSRs', '', '');

        //Added 10/7/2013 - if team leader, allow messaging to other CSRs
        if ($.cookie("TP1Role") == "Team Leader") {
            $("#composeto").append($('<optgroup label="OTHER CSRs ON PROJECT"></optgroup>'));
            if (msg.contacts.othercsrs) {
                for (var i in msg.contacts.othercsrs) {
                    $("#composeto").children().last().append($('<option></option>').val(msg.contacts.othercsrs[i].username).html(msg.contacts.othercsrs[i].name.replace(/'/g, '')));
                }
            }
        }

        if (!issub) {
            $("#composeto").append($('<optgroup label="SUPERVISORS"></optgroup>'));
            if (msg.contacts.supervisors) {
                for (var i in msg.contacts.supervisors) {
                    $("#composeto").children().last().append($('<option></option>').val(msg.contacts.supervisors[i].username).html(msg.contacts.supervisors[i].name.replace(/'/g, '')));
                }
            }
        }
        //load managers.
        $("#composeto").append($('<optgroup label="MANAGERS and ADMINISTRATION"></optgroup>'));
        if (msg.contacts.managers) {
            for (var i in msg.contacts.managers) {
                $("#composeto").children().last().append($('<option></option>').val(msg.contacts.managers[i].username).html(msg.contacts.managers[i].name.replace(/'/g, '')));
            }
        }


        //if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin")) {
        if ($.cookie("TP1Role") != "CSR") {
            if (($.cookie("ApmProjectFilter") == "none") || ($.cookie("ApmProjectFilter") == "")) {
                $("#composeto").append($('<optgroup label="LOCATIONS"></optgroup>'));
                for (var i in msg.locations) {
                    $("#composeto").children().last().append($('<option></option>').val("ALL/LOCATION/" + msg.locations[i].id).html("All " + msg.locations[i].name + " Agents"));
                    //alert("debug:Location=" + msg.locations[i].id + "-" + msg.locations[i].name);
                }
                /* - No longer needed, these are now handled by GetDistroGroups
                if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "dev.") || (a$.urlprefix().indexOf("make40.") >= 0)) {
                //TODO: Change the key to be prefixed by DISTRO_ and include these in the custom distro.
                $("#composeto").append($('<option></option>').val("EVERYONE").html("All First-Party Agents"));
                $("#composeto").append($('<option></option>').val("EVERYONEEXCEPTRCM").html("All First-Party Agents Except RCM"));
                }
                */
                //TODO: Get Distro Lists
                //Custom distros prefixed by DISTRO_CODE_
                //Table distros prefixed by DISTRO_TABLE_
            }
        }

        a$.showprogress("messageprogress");
        a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "msg", cmd: "GetDistroGroups", role: $.cookie("TP1Role") },
            dataType: "json", cache: false, error: a$.ajaxerror, success: gotDistros
        });
        function gotDistros(json) {
            a$.hideprogress("messageprogress");
            if (a$.jsonerror(json)) {
            }
            else {
                for (var i in json.distros) {
                    $("#composeto").append($('<option></option>').val(json.distros[i].code).html(json.distros[i].name));
                }
            }
            for (var i in sv) {
                if ($('#composeto option[value="' + sv[i].val + '"]').length > 0) {
                    //It's here, now select it.
                    $('#composeto option[value="' + sv[i].val + '"]').each(function () {
                        $(this).attr("selected", "selected");
                    });
                }
                else {
                    $("#composeto").append($('<option></option>').val(sv[i].val).html(sv[i].text.replace(/'/g, '')).attr("selected", "selected"));
                }
            }
            $("#composeto").data("Placeholder", "Select Framework...").chosen();
            $("#composeto").trigger("liszt:updated");
            $("#composeto").bind("change", function () {
                msgchecksend();
                //alert($(this).val());
            });
            msgchecksend();
        }

    }

    function loadtooptions(mysel, selid, prefix, suffix) {
        var vl;
        $("#" + selid + " option").each(function () {
            vl = $(this).val();
            if ((vl != "") && (vl != "each"))
                mysel.append($('<option></option>').val("COMBO/" + selid + "/" + $(this).val()).html(prefix + $(this).text().replace(/'/g, '') + suffix));
        });
    }

    function killactionscraper() {
        var databld = { cmd: "killactionscraper" /* , username: $.cookie("TP1Username") */ };
        a$.ajax({
            type: "GET", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
            success: loaded
        });
        function loaded(json) {
            if (a$.jsonerror(json)) {
            }
            else {
            }
        }
    }

    function showmessagelist(activelabel) {
        $("#messages").html("");
        var tot = { unread: 0, incomplete: 0 };
        for (var i in msg.labels) {
            var unread = 0;
            var incompleteactions = 0;
            if (msg.labels[i].name == "Inbox") {
                unread += msg.labels[i].totalunread;
                tot.unread += msg.labels[i].totalunread;
            }
            else {
                for (var j in msg.messages) {
                    if (msg.messages[j].read == "N") {
                        for (var k in msg.messages[j].labels) {
                            if (msg.messages[j].labels[k].id == msg.labels[i].id) {
                                unread += 1;
                                tot.unread += 1;
                            }
                        }
                    }
                }
            }
            for (var j in msg.messages) {
                for (var a in msg.messages[j].actions) {
                    if (msg.messages[j].actions[a].completed == "No") {
                        for (var k in msg.messages[j].labels) {
                            if (msg.messages[j].labels[k].id == msg.labels[i].id) {
                                incompleteactions += 1;  //TODO: This needs passed in from the initial inbox load.  Can this be done with a single query the way it's set up?
                                tot.incomplete += 1;
                            }
                        }
                    }
                }
            }
            var bld = '<div class="messages-box-wrapper"><a class="messages-box" href="#"><span class="messages-box-name">' + msg.labels[i].name + "</span>";
            if (unread > 0) {
                bld += '<span class="messages-box-unread">' + unread + '</span>';
            }
            if (incompleteactions > 0) {
                bld += '<span class="messages-box-incomplete">' + incompleteactions + '</span>';
            }
            bld += "</span></a></div>";
            $("#messages").append(bld);
        }

        //Changed 11/5/2015, I think this is better
        $(".messages-box").each(function () {
            var lab = $(this).children(":first").html();
            if (activelabel == lab) {
                $(this).addClass("messages-box-active");
            }
            else {
                $(this).removeClass("messages-box-active");
            }
        });

        $('.messages-box-unread').qtip({
            content: 'Unread Messages',
            show: 'mouseover',
            hide: 'mouseout'
        });

        $('.messages-box-incomplete').qtip({
            content: 'Incomplete Assignments',
            show: 'mouseover',
            hide: 'mouseout'
        });

        /*
        $(".message-box-unread").live("mouseover mouseout", function (e) {
        if (e.type == "mouseover") {
        $(this).parent().parent().addClass("message-row-hover");
        }
        else {
        $(this).parent().parent().removeClass("message-row-hover");
        }
        });
        */
        $(".messages-box").bind("click", function () {
            var lab = $(this).children(":first").html();
            $(".messages-box").removeClass("messages-box-active");
            $(this).addClass("messages-box-active");
            showmessagebox(lab);
            return false;
        });

        if (tot.unread > 0) {
            $(".messages-badge-unread").show().html(tot.unread);
        }
        else {
            $(".messages-badge-unread").hide();
        }
        if (tot.incomplete > 0) {
            $(".messages-badge-incomplete").show().html(tot.incomplete);
        }
        else {
            $(".messages-badge-incomplete").hide();
        }
        return tot;
    }

    function showmessagebox(lab, donttab) {
        var idlab = getlabid(lab);
        switch (location.hash) {
            case "#Messaging":
            case "#Classic":
            case "":
                $('#messagetab').show();
        }
        if (!donttab) $('#messageslabel').trigger('click');
        var bld = '<div class="message-boxtitle">' + lab;
        bld += '</div>';
        bld += '<table>';
        var foundone = false;
        //CHANGE 2015-11-03 for 1.3 - NOT REVERSING NOW: for (var j = msg.messages.length - 1; j >= 0; j--) {
        for (var j in msg.messages) {
            for (var k in msg.messages[j].labels) {
                if (msg.messages[j].labels[k].id == idlab) {
                    foundone = true;
                    bld += '<tr class="message-row'
                    if (msg.messages[j].read == "N") {
                        bld += " message-row-unread";
                    }
                    bld += '"><td style="display:none;">' + j + '</td>';
                    //bld += '<span style="display:none;">' + lab + '</span>';
                    if (lab == "Sent Messages") {
                        var tos = msg.messages[j].to.toString().split("~");
                        var tobld = "";
                        for (var t in tos) {
                            if (tobld != "") tobld += "; ";
                            tobld += tos[t].split("|")[0];
                        }
                        bld += '<td><p class="message-row-to message-cell">' + tobld + '</p></td>';
                    }
                    else {
                        /* bld += '<span class="message-row-read">' + msg.messages[j].read + '</span>'; */
                        bld += '<td><p class="message-row-from message-cell">' + msg.messages[j].from.toString() + '</p></td>';
                    }
                    bld += '<td><p class="message-row-subject message-cell">' + msg.messages[j].subject + '</p></td>';
                    var isassignment = false;
                    var iscomplete = true;
                    var actions = msg.messages[j].actions;
                    for (var a in actions) {
                        isassignment = true;
                        if (actions[a].completed == "No") iscomplete = false;
                    }
                    bld += '<td><p class="message-row-preview message-cell">';
                    if (isassignment) {
                        if (iscomplete) {
                            bld += 'Complete';
                        }
                        else {
                            bld += '<span class="message-row-incomplete">Incomplete</span>';
                        }
                    }
                    else {
                        //CHANGED:  11/3/2015 - Remove all tags from the first 150 chars.
                        var pv = msg.messages[j].body;
                        var pd = "";
                        var p = 0;
                        var intag = false;
                        while (p < pv.length) {
                            if (intag) {
                                if (pv[p] == '>') {
                                    intag = false;
                                }
                            }
                            else if (pv[p] == "<") {
                                intag = true;
                            }
                            else {
                                pd += pv[p];
                                if (pd.length > 50) {
                                    break;
                                }
                            }
                            p += 1;
                        }
                        bld += pd;
                    }
                    bld += '</p></td>';
                    bld += '<td><p class="message-row-date message-cell">' + msg.messages[j].date + '</p></td>';
                    bld += '</tr>';
                }
            }
        }
        bld += '</table>';
        var doinitialload = false;
        if (!foundone) {
            for (var k in msg.labels) {
                if (msg.labels[k].name == lab) {
                    if (msg.labels[k].endconfirmed == "N") {
                        doinitialload = true;
                    }
                }
            }
            if (!doinitialload) {
                bld += "<p>(No Messages)</p>";
            }
        }

        $('#messagearea').html(bld);

        if (doinitialload) {
            loadnextpage();
            return false;
        }

        $("#messagearea").unbind().bind("scroll", function () {
            var endreached = false;
            if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
                endreached = true;
            }
            if (endreached) {
                $(this).unbind();
                loadnextpage();
            }
        });

        $(".message-row td p").live("mouseover mouseout", function (e) {
            if (e.type == "mouseover") {
                $(this).parent().parent().addClass("message-row-hover");
            }
            else {
                $(this).parent().parent().removeClass("message-row-hover");
            }
        });

        $(".message-row").bind("click", function () {
            var msgidx = parseInt($(this).children().first().html());
            if (msg.messages[msgidx].read != "Y") {
                msg.messages[msgidx].read = "Y";
                for (var k in msg.labels) {
                    if (msg.labels[k].name == "Inbox") {
                        for (var j in msg.messages[msgidx].labels) {
                            if (msg.messages[msgidx].labels[j].id == msg.labels[k].id) {
                                msg.labels[k].totalunread -= 1;
                                break;
                            }
                        }
                    }
                }
                a$.ajax({
                    type: "GET", async: true, data: { cmd: "messagemarkread", messageid: msg.messages[msgidx].id, read: "Y" }, dataType: "json", cache: false, error: a$.ajaxerror
                });
            }
            showmessagelist(lab);
            var bld = '<div class="message-view-return"><a href="#">&lt; Return to ' + lab + '</a><span style="display:none;">' + lab + '</span></div>';
            bld += '<div class="message-view-menu">';

            if ((lab != "Deleted") && (lab != "Sent Messages")) {
                if (msg.messages[msgidx].actions.length == 0) {
                    bld += '<span><a href="#"><span style="display:none;">replyall</span>Reply All</a></span>';
                }
            }

            if (lab == "Inbox") {
                bld += '<span><a href="#"><span style="display:none;">archive</span>Archive</a></span>';
            }
            else if (lab != "Sent Messages") {
                bld += '<span><a href="#"><span style="display:none;">movetoinbox</span>Move to Inbox</a></span>';
            }
            if ((lab != "Deleted") && (lab != "Sent Messages")) {
                bld += '<span><a href="#"><span style="display:none;">delete</span>Delete</a></span>';
                if (msg.messages[msgidx].actions.length == 0) {
                    bld += '<span><a href="#" style="font-weight:bold;"><span style="display:none;">reply</span>Reply</a></span>';
                }
            }
            bld += '<span>' + msg.messages[msgidx].date + '</span>';
            bld += '</div>';
            bld += '<div class="message-view-subject">' + msg.messages[msgidx].subject + '</div>';
            bld += '<div class="message-view-from">From: ' + msg.messages[msgidx].from.toString() + '</div>';
            var tos = msg.messages[msgidx].to.toString().split("~");
            var tobld = "";
            for (var t in tos) {

                if (tobld != "") tobld += "; ";
                var toss = tos[t].split("|");
                tobld += toss[0];
            }
            bld += '<div class="message-view-to">To: ' + tobld + '</div>';
            //10/14 - Literal HTML code - to help debug.
            bld += '<div class="message-view-body">' + msg.messages[msgidx].body + '</div>';
            //bld += '<textarea readonly class="message-view-body" style="width:100%">' + msg.messages[msgidx].body + '</textarea>';
            $('#messagearea').html(bld);
            $(".message-view-return a").bind("click", function () {
                showmessagebox(lab);
                return false;
            });
            $('.message-view-menu span a').bind("click", function () {
                var button = $(this).children(":first").html();
                if (button == "archive") {
                    messageremovelabel(msgidx, "Inbox");
                    messageaddlabel(msgidx, "Archive");
                    showmessagebox(lab);
                    showmessagelist(lab);
                }
                else if (button == "movetoinbox") {
                    if ((lab == "Archive") || (lab == "Deleted")) messageremovelabel(msgidx, lab);
                    messageaddlabel(msgidx, "Inbox");
                    showmessagebox(lab);
                    showmessagelist(lab);
                }
                if (button == "delete") {
                    for (var i in msg.messages[msgidx].labels) {
                        //if (msg.messages[msgidx].labels[i].id != 2) { //2 is deleted.
                        messageremovelabel(msgidx, getlabname(msg.messages[msgidx].labels[i].id));
                        //}
                    }
                    messageaddlabel(msgidx, "Deleted");
                    showmessagebox(lab);
                    showmessagelist(lab);
                }
                if (button == "reply") {
                    $(".messages-compose input").trigger("click");
                    $(".message-compose-caption").each(function () { $(this).html("Reply"); });
                    var from = msg.messages[msgidx].from.toString();
                    if ($('#composeto option[value="' + from + '"]').length > 0) {
                        //It's here, now select it.
                        $('#composeto option[value="' + from + '"]').each(function () {
                            $(this).attr("selected", "selected");
                        });
                    }
                    else {
                        $("#composeto").append($('<option></option>').val(from).html(from).attr("selected", "selected"));
                    }
                    $("#composeto").trigger("liszt:updated");

                    var subject = msg.messages[msgidx].subject;
                    if (subject.indexOf("RE:") >= 0) {
                        $("#composesubject").val(subject);
                    }
                    else {
                        $("#composesubject").val("RE:" + subject);
                    }
                    var bld = "<br /><br />On " + msg.messages[msgidx].date + ", " + from + " wrote:<br />" + msg.messages[msgidx].body;
                    //bld = bld.replace(/<br \/>/g, "\n");
                    $("#composebody").html(bld);
                    $("#composebody").focus();
                }
                if (button == "replyall") {
                    $(".messages-compose input").trigger("click");
                    $(".message-compose-caption").each(function () { $(this).html("Reply"); });
                    var from = msg.messages[msgidx].from.toString();
                    if ($('#composeto option[value="' + from + '"]').length > 0) {
                        //It's here, now select it.
                        $('#composeto option[value="' + from + '"]').each(function () {
                            $(this).attr("selected", "selected");
                        });
                    }
                    else {
                        $("#composeto").append($('<option></option>').val(from).html(from).attr("selected", "selected"));
                    }
                    //Addeded 9/28/2015
                    var tos = msg.messages[msgidx].to.toString().split("~");
                    var me = $.cookie("TP1Username");
                    me = me.toLowerCase();
                    for (var t in tos) {
                        var toss = tos[t].split("|");
                        if (toss[1].toLowerCase() != me) {
                            $("#composeto").append($('<option></option>').val(toss[1]).html(toss[0]).attr("selected", "selected"));
                        }
                    }

                    $("#composeto").trigger("liszt:updated");

                    var subject = msg.messages[msgidx].subject;
                    if (subject.indexOf("RE:") >= 0) {
                        $("#composesubject").val(subject);
                    }
                    else {
                        $("#composesubject").val("RE:" + subject);
                    }
                    var bld = "<br /><br />On " + msg.messages[msgidx].date + ", " + from + " wrote:<br />" + msg.messages[msgidx].body;
                    //bld = bld.replace(/<br \/>/g, "\n");
                    $("#composebody").html(bld);
                    $("#composebody").focus();
                }

                return false;
            });

            //Added: 2019-09-16
            //<span class="message-service" service="LaunchReview" params="CSR=sbland&Team=19">click me</span>
            $(".message-service").unbind().bind("click", function () {
                var myservice = $(this).attr("service");
                appApmContentTriggers.process(myservice, this);
            });

            for (var a in msg.messages[msgidx].actions) {
                if (msg.messages[msgidx].actions[a].type == "QuizNotification") {
                    var action = msg.messages[msgidx].actions[a];
                    /*
                    alert("debug:Calling Test");
                    alert("debug:CTsrvy_id=" + action.srvy_id);
                    alert("debug:CTduedate=" + action.duedate);
                    alert("debug:CTurl=" + action.url);
                    alert("debug:CT EOB");
                    */
                    a$.ajax({
                        type: "GET", async: true, data: { cmd: "IsActionComplete", srvy_id: action.srvy_id, type: action.type, idmsg: msg.messages[msgidx].id }, dataType: "json", cache: false, error: a$.ajaxerror,
                        success: loaded
                    });
                    function loaded(json) {
                        if (a$.jsonerror(json)) {
                        }
                        else {
                            if (json.answer == "No") {
                                /*
                                alert("debug:fetching URL");
                                alert("debug:srvy_id=" + action.srvy_id);
                                alert("debug:duedate=" + action.duedate);
                                alert("debug:url=" + action.url);
                                alert("debug:fetching URL EOB");
                                */
                                $("#messagearea").append('<div class="message-view-action-quiznotification"><span>Due Date: ' + action.duedate + '</span><br /><br /><a target="_blank" href="' + action.url.replace(/& /g, "%26 ").replace("/ers.", "/" + a$.urlprefix()) + '">Click Here to Take Quiz/Survey.</a></div>');
                                action.completed = "No";
                            }
                            else {
                                $("#messagearea").append('<div class="message-view-action-quiznotification">This Quiz/Survey was completed ' + json.completiondate + '</div>');
                                action.completed = "Yes";
                            }
                        }
                        showmessagelist("");
                    }
                }
            }
            return false;
        });
    }

    function messageaddlabel(msgidx, lab) {
        var labid = getlabid(lab);
        var found = false;
        for (var i in msg.messages[msgidx].labels) {
            if (msg.messages[msgidx].labels[i].id == labid) {
                found = true;
                break;
            }
        }
        if (!found) { //really needs added
            msg.messages[msgidx].labels[msg.messages[msgidx].labels.length] = new Object();
            msg.messages[msgidx].labels[msg.messages[msgidx].labels.length - 1].id = labid;
            a$.ajax({
                type: "GET", async: true, data: { cmd: "messagelabels", subcmd: "add", messageid: msg.messages[msgidx].id, labelid: labid }, dataType: "json", cache: false, error: a$.ajaxerror
            });
        }
    }

    function messageremovelabel(msgidx, lab) {
        var labid = getlabid(lab);
        for (var i in msg.messages[msgidx].labels) {
            if (msg.messages[msgidx].labels[i].id == labid) { //really needs removed
                msg.messages[msgidx].labels.splice(i, 1);
                a$.ajax({
                    type: "GET", async: true, data: { cmd: "messagelabels", subcmd: "remove", messageid: msg.messages[msgidx].id, labelid: labid }, dataType: "json", cache: false, error: a$.ajaxerror
                });
            }
        }
    }

    function getlabid(lab) {
        for (var i in msg.labels) {
            if (msg.labels[i].name == lab) {
                return msg.labels[i].id;
            }
        }
        return 0;
    }

    function getlabname(id) {
        for (var i in msg.labels) {
            if (msg.labels[i].id == id) {
                return msg.labels[i].name;
            }
        }
        return 0;
    }


    function getsup_name(i) {
        return msg.contacts.supervisors[i].name;
    }

    function getsup_username(i) {
        return msg.contacts.supervisors[i].username;
    }

    function getmgr_name(i) {
        return msg.contacts.managers[i].name;
    }

    function getmgr_username(i) {
        return msg.contacts.managers[i].username;
    }

    function getsup_cnt() {
        return msg.contacts.supervisors.length;
    }

    function getmgr_cnt() {
        return msg.contacts.managers.length;
    }

    /*
    TODO:
    chatparties (chat-parties class)
    chat-area (class)
    inputline
    returnline
    */

    function initchatwindow() {

    var bld2 = "";
    bld2 += '<video id="selfview" style="height:100px;width:100px;background-color:blue;position:fixed;bottom:0px;left:0px;z-index:1000000;" />';
    bld2 += '<video id="remoteview" style="height:100px;background-color:green;width:100px;position:fixed;bottom:101px;left:0px;z-index:1000000;" />';
    bld2 += '<input type="checkbox" id="videohome" style="position:fixed;bottom:0px;left:101px;z-index:1000000;" />';
    $("body").prepend(bld2);
    selfView = document.getElementById('selfview');
    remoteView = document.getElementById('remoteview');
    $("#videohome").unbind().bind("click", function() {
        if ($(this).is(":checked")) {
            videostart();
            a$.ajax({
                type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "chat", cmd: "chatpost", guid: guid, post: "videohome:" + guid, cps: $.cookie("TP1Username").toLowerCase().split(",") }, dataType: "json", cache: false, error: a$.ajaxerror,
                /* success: chatposted */
            });
        }
    });


        $(".chat-window").remove();
        //if ($(".chat-window").length == 0) {
        //var bld = '<div class="chat-window"><div class="chat-label">Chat' + /* TODO: REMOVED FOR NOW <span class="chat-plus">+</span> */'</div>';
        //very old: var bld = '<div class="chat-window"><div class="chat-label">Chat</div><div class="chat-select"><select data-placeholder="Chat with..." class="chat-parties" id="chatparties" multiple></select></div><div class="chat-area"></div><div class="chat-send">' + $.cookie("TP1Username") + ':&nbsp;<input id="inputline" type="text"/><input id="returnline" type="text" style="border:0;width:0px"/></div><div class="poll-suspend"></div><span class="chat-stats"></span><div class="chat-save">Save</div><div class="chat-mute"><input type="checkbox" /><label>Mute</label></div><div class="chat-refresh" href="#">Refresh List</div><a class="window-close chat-window-close" href="#">X</a></div>'


        var bld = '<div class="chat-window" id="draggableChatWindow">';

        bld += '<div class="chat-label" >Chat';

        if (false) { //($.cookie("TP1Role") == "Admin") {
            bld += '<span class="chat-plus">+</span><span class="chat-plus-team"><i class="fas fa-users-medical"></i></span>';
            chat20ui = true;
        }
        else {
            switch ($.cookie("TP1Username").toLowerCase()) {
                case "shspencer":
                case "kpatton":
                case "lojohnson":
                case "jeffgack":
                case "gsalvato":
                case "jfield":
                case "dweather":
                default:
                    bld += '<span class="chat-plus-team" title="View All Team Members"><i class="fad fa-users"></i></span>';
                    chat20ui = true;
            }
        }

        bld += '<div class="poll-suspend"></div><span class="chat-stats"></span><div class="chat-select-all" title="Select all team members currently Online">Select All Online</div><div class="chat-save">Save</div>';
        if ((a$.urlprefix(true).indexOf("mnt") == 0) || (a$.urlprefix() == "km2.") || (a$.urlprefix() == "bgr.") || (a$.urlprefix() == "compliance-demo.")) {
            bld += '<div class="chat-meet" title="Click to Start a New Meeting"><i class="fas fa-users-class"></i></div>';
        }
        bld += '<div class="chat-mute"><input type="checkbox" /><label>Mute</label></div><div class="chat-refresh" href="#"><i class="fa fa-sync-alt"></i></div><a class="window-close chat-window-close" href="#" title="Close Chat Box"><i class="fa fa-times"></i></a>';
        bld += '</div>';

        bld += '<div class="chat-sessions">';

        for (var i = numsessions - 1; i >= 0; i--) {
            if (i > 0) {
                bld += '<div class="chat-session">';
                bld += '<div class="chat-session-close" title="Remove Team Member">X</div>';
            }
            else {
                bld += '<div class="chat-session chat-session-active">';
            }
            bld += '<div class="chat-select chat-select-primary">';
            if (false) { //($.cookie("TP1Role") == "Admin") { //check this box for everybody
                bld += '<input class="chat-talking" type="checkbox" />';
            }
            else {
                bld += '<input class="chat-talking" type="checkbox" checked />';
            }
            bld += '<div class="chat-chosenbox"><select data-placeholder="Chat with Team Members currently online..." class="chat-parties" id="chatparties" multiple></select></div></div>';
            if (chat20ui) { //Trying the look of having the group window tall.
                bld += '<div class="chat-area chat-area-group" style="height: 190px; max-height: 190px;"></div>';
                //bld += '<div class="chat-area"></div>';
            }
            else {
                bld += '<div class="chat-area chat-area-group" style="height: 260px; max-height: 260px;"></div>';
            }
            bld += '</div>';
        }
        bld += '</div>';

        bld += '<div class="chat-send" style="width: 400px;white-space: nowrap;">' + $.cookie("TP1Username") + ':&nbsp;<input class="chat-inputline" type="text"/>';
        bld += '<input class="chat-returnline" type="text" style="border:0;width:0px"/></div></div>';

        //Select Person(s) for Chat.
        $("body").append(bld);
        $("#draggableChatWindow").draggable({
            containment: "#tabs",
            snap: "#tabs",
            snapMode: "inner",
            snapTolerance: "16",
            scroll: false
        });

        $(".chat-window-close").unbind().bind("click", function () {
            //CHATPINGDELAY = OUTOFCHATDELAY;
            lastchatlifesign = 0; //Assume if they close the chat window that they need notified.
            $(this).parent().parent().hide();
            return false;
        });

        $(".chat-plus").unbind().bind("click", function () {
            numsessions += 1;
            clickedchatbubble();
            var bld = bldChatWindow({});
            $(".chat-sessions").prepend(bld);
            chatlistinit(false);
            bindchatsession(true);
        });

        affirmTeamLinkDisplay();
        $(".chat-plus-team").unbind().bind("click", function () {
            //TODO: Make this toLowerCase thing done at a higher level.  It's silly to be converting during comparison.
            for (var i in lastchatees.chatees) {
                lastchatees.chatees[i].uid = lastchatees.chatees[i].uid.toString().toLowerCase();
            }
            $(".chat-window").addClass("expanded");
            $($("#selCSRs option").get().reverse()).each(function () {
                var csr = $(this).val();
                if ((csr != "") && (csr != "each")) { //debug
                    csr = csr.toLowerCase();
                    addsingle(csr, $(this).html());
                }
            });
            if (numsessions > 1) {
                $(".chat-select-all").show();
            }
        });

        bindchatsession(false);
        if ($.cookie("TP1Role") != "CSR") {
            $(".chat-meet").show().unbind().bind("click", function () {
                //alert("debug:open meeting with you as leader, warn that you're already in a meeting");
                var startmeeting = true;
                var portback = "https://azschool.trainingroom.us:3000/login?userid=" + $.cookie("TP1Username") + "&room=" + a$.urlprefix(true) + $.cookie("TP1Username") + "&leadertoken=arrrrsdadf5552332";
                if ($("#MeetIframe").attr("src") != "") {

                    if ($("#MeetIframe").attr("src") != portback) {
                        if (!confirm("Would you like to abandon the current meeting and start a new one?")) {
                            startmeeting = false;
                        }
                    }
                }
                NOBODYSELECTED = false;
                if (startmeeting) {
                    //send message to all active to join your meeting.
                    $("#MeetIframe").attr("src", portback).show();
                    $(".chat-inputline").val('<div class="meeting-join" room="' + a$.urlprefix(true) + $.cookie("TP1Username") + '">Join My Meeting »</div>').trigger("change");
                    if (NOBODYSELECTED) {
                        $(".chat-inputline").val(""); //override markup in box.
                    }
                    //NOBODYSELECTED MAY HAVE BEEN SET to true.
                }
                if (!NOBODYSELECTED) {
                    $(".meet-message").hide();
                    $("#meettab").show();
                    $("#meetlabel").trigger("click");
                    $(".chat-window-close").trigger("click");
                }

            });
        }

        $(".chat-save").unbind().bind("click", function () {
            //TODO: Save the chat.
            //chatlog.push({ time: now, from: json.posts[i].from.toString(), to: $.cookie("TP1Username"), msg: json.posts[i].msg.toString() });
            $(".chat-save").hide();
            $(".chat-stats").html("Saving...");
            $(".chat-stats").show();
            var bld = "";
            var tostr = $.cookie("TP1Username") + "|" + $.cookie("TP1Username");
            for (var i in chatlog) {
                bld += chatlog[i].time + " - From:" + chatlog[i].from.toString() + ", To:" + chatlog[i].to.toString() + ", MSG:" + chatlog[i].msg.toString() + "<br />";
            }
            value = bld.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\\/g, "|");

            //ADDED: 2015-11-04
            var reLF = new RegExp(String.fromCharCode(13), "g");
            value = value.replace(reLF, ''); //line feeds cause dumps.
            var reCR = new RegExp(String.fromCharCode(10), "g");
            value = value.replace(reCR, ''); //carriage return also causes dumps.

            setTimeout(function () {
                $(".chat-stats").hide();
            }, 5000);

            a$.ajax({
                type: "POST", async: true, data: { cmd: "messagesend", to: tostr, read: "Y", folder: "Chat Log", subject: "Chat Log", body: value }, dataType: "json", cache: false, error: a$.ajaxerror,
                success: chatlogsaved
            });
            function chatlogsaved(json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    chatlog = [];
                    lastchattimestamp = 0;
                    $(".chat-area").append('<div class="chat-timestamp">- Conversation Saved -</div>');
                    $('.chat-area').scrollTop($('.chat-area')[0].scrollHeight); //review
                    $(".chat-stats").hide();
                }
            };
        });

        $(".chat-select-all").unbind().bind("click", function () {
            $(".chat-talking").prop("checked", false);
            var foundonline = false;
            $(".chat-online-yes").each(function () {
                $(" .chat-talking", $(this).parent().parent()).prop("checked", true);
                foundonline = true;
            });
            $(".chat-parties").each(function () {
                if ($(this).val() != null) {
                    $(" .chat-talking", $(this).parent().parent()).prop("checked", true);
                    foundonline = true;
                }
            });
            if (!foundonline) {
                alert("No team members are currently on-line.");
            }
        });

        //8/26/2014 - Do ChatListInit upon startup.
        chatlistinit(true);
        $(".chat-refresh").unbind().bind("click", function () {
            touchchat();
            showlife();
            chatlistinit(true); //Note: Effectively disabled currently (refresh is missing)
        });

        $('.chat-refresh').qtip({ content: 'Click to refresh the list of potential chatees.', position: { my: 'right bottom', at: 'left top'} });

        $(".chat-window,.headericon-chat,.chat-beep-icon").unbind("mousemove").bind("mousemove", function () {
            touchchat();
            showlife();
        });
        $(".chat-window").hide();
    }

    function clickedchatbubble() {
        touchchat();
        var w = numsessions;
        if (w > 4) { w = 4; } //Go horizontal, then vertical.
        w = 1; //debug;
        //w = Math.floor((numsessions + 1) / 2); //Go vertical then horizontal.

        //$(".chat-window").show().animate({ width: (w * 300) + "px" }, 500);
        //$(".chat-window").css("width", "500px").show().animate({ width: (w * 300) + "px" }, 500);
        $(".chat-window").show().css("width", (w * 315) + "px").css("margin-bottom", "20px");
        $('.chat-area').scrollTop($('.chat-area')[0].scrollHeight); //review
        $("#inputline").focus();

        if (a$.urlprefix() == "chimeNOTUSING.") {
            a$.ajax({ //Changed 2018-12-07
                type: "POST", service: "JScript", async: true, data: { lib: "chat", cmd: "getGameMates" }, dataType: "json", cache: false, error: a$.ajaxerror,
                success: gotGameMates
            });
            function gotGameMates(json) {
                if (a$.jsonerror(json)) {
                    //alert("debug:get chatee json error?");
                }
                else {
                    var foundone = false;
                    for (var i in json.mates) {
                        if (json.mates[i].uid.toLowerCase() != $.cookie("TP1Username").toLowerCase()) {
                            foundone = true;
                            numsessions += 1;
                            var online = false;
                            var bld = bldChatWindow({ chatWith: { text: json.mates[i].name + " (" + json.mates[i].role + ")", val: json.mates[i].uid, online: online, select: true} });
                            if (bld != "") {
                                $(".chat-sessions").prepend(bld);
                                //chatlistinit(false);
                                bindchatsession(true);
                            }
                        }
                    }
                    if (foundone) {
                        $(".chat-label").html("Game Chat - " + json.teamname);
                    }
                    else {
                        $(".chat-label").html("Chat");
                    }
                }
            }

        }
        //end testing

    }


    function chatlistinit(fromserver) {
        if (fromserver) {
            $(".chat-refresh").html("...refreshing").css("text-decoration", "none");
            a$.ajax({ //Changed 2018-12-07
                type: "POST", service: "JScript", async: true, data: { lib: "chat", cmd: "getchatees" }, dataType: "json", cache: false, error: a$.ajaxerror,
                success: gotchatees
            });
        }
        function gotchatees(json) {
            lastchatees = json;
            $(".chat-refresh").html("<i class='fa fa-sync-alt'>");
            if (a$.jsonerror(json)) {
                //alert("debug:get chatee json error?");
            }
            else {
                //alert("debug:get chatee json success?");

                //DEBUG: $("#chatparties option").remove();

                //DONE:Add to Chat parties (if they are not already in the list).

                //TODO: Splice out the chatees that are not allowed.

                //CSRs can chat with Supervisors (only their supervisor is in this structure).
                //msg.contacts.supervisors //
                //msg.contacts.managers // (will be just me).

                //Team Leaders can chat with members of their team:
                //loadtooptions($("#composeto").children().last(), 'selCSRs', '', '');
                //msg.contacts.supervisors //
                //msg.contacts.managers // (will several).
                //msg.contacts.managers[i].username and .name

                //All others can chat with anyone.
                var oktoload = false;
                //alert("debug:got chatees");
                //alert("debug:role=" + $.cookie("TP1Role"));
                /*
                for (var c in json.chatees) {
                alert("debug:chatee " + c + " = " + json.chatees[c].uid);
                }
                */
                var nmbef = "";
                var nmaft = "";
                if (/*($.cookie("TP1Role") == "Team Leader") || */($.cookie("TP1Role") == "CSR")) {
                    if (msg) if (msg.contacts) if (msg.contacts.managers) if (msg.contacts.supervisors) {
                        //if ($.cookie("TP1Username") == "jflores") alert("debug: chat candidates = " + json.chatees.length);
                        for (var i in json.chatees) {
                            //alert("debug:candidate=" + json.chatees[i].uid);
                            var found = false;
                            for (var j in msg.contacts.supervisors) {
                                if (msg.contacts.supervisors[j].username.toLowerCase() == json.chatees[i].uid.toString().toLowerCase()) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                for (var k in msg.contacts.managers) {
                                    if (msg.contacts.managers[k].username.toLowerCase() == json.chatees[i].uid.toString().toLowerCase()) {
                                        found = true;
                                        break;
                                    }
                                }
                            }
                            if (!found) {
                                /* TODO: This isn't working - PLUS it probably isn't really what we want for team leaders. */
                                //alert("debug: here check");
                                $("#selCSRs option").each(function () {
                                    //alert("debug: val=" + $(this).val());
                                    var vl = $(this).val();
                                    if (vl.toLowerCase() == json.chatees[i].uid.toString().toLowerCase()) {
                                        found = true;
                                    }
                                });
                            }
                            /*
                            if ($.cookie("TP1Username") == "jflores") {
                            if (found) {
                            nmbef += json.chatees[i].name + ",";
                            }
                            }
                            */
                            if (!found) {
                                //json.chatees.splice(i, 1);
                                //i -= 1;
                                json.chatees[i].uid = "";
                            }
                            //alert("debug: found = " + found);
                        }
                        oktoload = true;
                    }
                }
                else {
                    oktoload = true;
                }

                //if ($.cookie("TP1Username") == "jflores") alert("debug: chatees remaining = " + json.chatees.length);

                $(".chat-parties").each(function () {
                    var me = this;
                    if (oktoload) {
                        /*
                        if ($.cookie("TP1Username") == "jflores") {
                        for (var i in json.chatees) {
                        if (json.chatees[i].uid != "") {
                        nmaft += json.chatees[i].name + ",";
                        }
                        }
                        alert("debug2:before=" + nmbef);
                        alert("debug2:after=" + nmaft);
                        }
                        */

                        if ($(me).attr("id") != "chatparties") {
                            if ($(" option", this).length == 0) {
                                $(me).append($("<option></option>").attr("value", "").text("Chat with Team Members currently online..."));
                            }
                        }

                        //add options that are not in the list
                        for (var i in json.chatees) {
                            var found = false;
                            if (json.chatees[i].uid != "") {
                                var pass = true;
                                /*
                                //This was ill-conceived, since the chat is aleady based on the allowable people in messaging.
                                //I need to go install the USR_LOC logic in messaging, not here.
                                if ((a$.urlprefix().indexOf("make40.") >= 0) || (a$.urlprefix() == "sprintgame.")) {
                                if ($.cookie("TP1Role") == "CSR") {
                                var myloc = $("#selLocations").val();
                                if ((myloc != "") && (myloc != "each")) {
                                if (a$.exists(json.chatees[i].locs)) {
                                if (json.chatees[i].locs.length > 0) {
                                pass = false;
                                for (var c in json.chatees[i].locs) {
                                if (myloc == ("" + json.chatees[i].locs[c])) {
                                pass = true;
                                }
                                }
                                alert("debug: uid=" + json.chatees[i].uid + ", pass=" + pass);
                                }
                                }
                                }
                                }
                                }
                                */
                                if (pass) {
                                    if (!$(' option[value="' + json.chatees[i].uid + '"]', me).length) {
                                        $(me).append($("<option></option>").attr("value", json.chatees[i].uid).text(json.chatees[i].name.replace(/'/g, '')));
                                    }
                                }
                            }
                        }

                        //remove options that are in the list
                        $(" option", me).each(function () {
                            if ($(this).attr("value") != "") {
                                var found = false;
                                for (var i in json.chatees) {
                                    if (json.chatees[i].uid == $(this).attr("value")) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    if ($(this).attr("selected") == "selected") {
                                        //alert($(this).html() + " is no longer available for chat.");
                                        $(".chat-area-group").append('<div class="chat-timestamp">- ' + $(this).html() + ' no longer available -</div>');
                                        $('.chat-area-group').scrollTop($('.chat-area-group')[0].scrollHeight);
                                    }
                                    $(this).remove();
                                }
                            }
                        });
                    }
                    else {
                        chatloopcount = 10;
                        lastadd = 0;
                    }

                    //
                    //$("#chatparties").data("Placeholder", "Select Framework...").chosen();
                    var ph = "Select Person(s) for Chat...";
                    if (a$.exists(json.chatees)) {
                        if (!json.chatees.length) ph = "No one is available for chat.";
                    }
                    ph = "Chat with Team Members currently online...";

                    $(me).attr("data-placeholder", ph);
                    $(me).data("placeholder", ph);

                    $(me).chosen();

                    $(me).bind("change", function () {
                        $("#chatparties").chosen().change(function () {
                            //alert("debug: box height=" + $("#chatparties_chzn").height());
                            $(".chat-select-primary").css("height", $("#chatparties_chzn").height() + "px"); //TODO: This assumes a single chosen box (most of this stuff does).
                        });

                        //msgchecksend();
                        //alert($(this).val());
                    });
                    $(me).trigger("liszt:updated").trigger("change");
                    //$(".chat-select input").first().val(ph).css("width", "180px");
                });

                //DONE: Look for sessions with a connection indicator and update the color of the dot.
                $(".chat-single-wrapper").each(function () {
                    //alert("debug: checking:" + $(".chat-single", this).html());
                    var agent = $(".chat-single", this).html();
                    agent = agent.toLowerCase();
                    var found = false;
                    for (var i in json.chatees) {
                        if (agent == json.chatees[i].uid.toString().toLowerCase()) {
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        $(".chat-online", this).removeClass("chat-online-no").addClass("chat-online-yes");
                    }
                    else {
                        $(".chat-online", this).removeClass("chat-online-yes").addClass("chat-online-no");
                    }
                });

            }
            //TODO: Move all online wrappers to the bottom somehow (keep the alphabetical order).
            var mylist = $(".chat-sessions");
            var listitems = mylist.children(".chat-session");
            listitems.sort(function (a, b) {
                //Master window is always on the bottom.
                if ($(".chat-select-primary", a).length > 0) return 1; // a > b
                if ($(".chat-select-primary", b).length > 0) return -1; // a < b
                var aol = $(".chat-online-yes", a).length;
                var bol = $(".chat-online-yes", b).length;
                if (aol < bol) return -1;
                if (aol > bol) return 1;
                var compA = $(".chat-singlename", a).html();
                var compB = $(".chat-singlename", b).html();
                return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
            });
            $(mylist).append(listitems);

            //scroll all chat-areas to the bottom.
            $(".chat-area").each(function () {
                $(this).scrollTop($(this)[0].scrollHeight);
            });

            // - set timer for chatinlist
        }
        if (!fromserver) {
            gotchatees(lastchatees);
        }
    }

    var lastfrom = "(Unknown)";
    var lastmsg = "(Unknown)";
    function pingchat() {
        var rn = (new Date).getTime();
        if ((rn - lastpingtimestamp) < CHATPINGDELAY) return; //Keeps from fail-safe multi-looping.
        lastpingtimestamp = (new Date).getTime();
        var online = navigator.onLine;
        if ((!online) || pollingsuspended) {
            if (pollingsuspended) {
                var rightnow = (new Date).getTime();
                if ((rightnow - pollsuspensiontimestamp) > POLLSUSPENSIONDELAY) {
                    $(".chat-send").show();
                    $(".poll-suspend").hide();
                    pollingsuspended = false;
                }
                else {
                    var secs = Math.floor(((pollsuspensiontimestamp + POLLSUSPENSIONDELAY) - rightnow) / 1000);
                    var mins = Math.floor(secs / 60);
                    secs -= mins * 60;
                    $(".poll-suspend").html("Chat/Messages Suspended for " + mins + ":" + secs);
                }
            }
            touchchat();
            CHATPINGDELAY = OUTOFCHATDELAY;
            setTimeout('appApmMessaging.pingchat()', CHATPINGDELAY);
            return;
        }
        //10/4/2015 - Added "managed" member and set it to 1.  This indicates that they have re-loaded code and are using a managed version of the code.  This # can increment as necessary.
        //2018-12-07 - Changed from GET to POST, will do some tests to see what happens.
        a$.ajax({
            type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "chat", cmd: "pingchat", managed: MANAGELEVEL, urlprefix: a$.urlprefix(), guid: guid, devmode: ($("#StgInjDev select").val() == "On") }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: pung
        });

        function pung(json) {
            if (a$.jsonerror(json)) {
            }
            else {
                /*
                if (exists(json.eval)) {
                    //alert("debug: eval found");
                    eval(json.eval);
                }
                */
                var stats = "";
                var iamremote = false;
                var rightnow = (new Date).getTime();
                if ((rightnow - chatlasttouch) > CHATIDLETIMEOUT) {
                    CHATPINGDELAY = OUTOFCHATDELAY;
                }
                stats += "Out:" + Math.floor((rightnow - chatlasttouch) / 1000);
                stats += " Cycle:" + (CHATPINGDELAY / 1000);

                //8/26/2014 - Chat List Population changing..
                //7/13/2016 - Putting automatic chat list retrieval back in for cases where there are multiple windows open (to allow easy update of the green/red dot).
                //This won't be a killer, because it only applies to supervisors generally.
                if ((json.lastadd - lastadd) > 0) {
                    if (((CHATPINGDELAY > INCHATDELAY) && (chatloopcount > CHATLOOPROUNDS)) || ((CHATPINGDELAY == INCHATDELAY) && (chatloopcount > (CHATLOOPROUNDS * 5)))) {
                        //alert("debug: new lastadd");
                        //if ($(".chat-select").length) { //WAS
                        if (numsessions > 1) { //IS (TODO: NOTE: We could do both (check selection box and check to see if there's more than 1 session).
                            //alert("debug: updating");
                            stats += " Updating Chat List...";
                            lastadd = json.lastadd;
                            chatlistinit(true);
                            chatloopcount = 0;
                        }
                    }
                }
                chatloopcount += 1;

                if (a$.exists(json.posts)) {
                    if (json.posts.length > 0) {
                        chatmessagespending = true;
                        if ($(".chat-window").is(':hidden')) {
                            clickedchatbubble();
                        }
                        else {
                            touchchat();
                        }
                        var now = new Date;
                        var now = now.toString().replace("US Eastern Daylight Time", "EDT");
                        //Cases
                        //agent is in the single, but is not in the group chat (should show in single only)
                        //agent is a chat-single and also in the group chat (should show up in both)
                        //agemt is NOT in single, but is in the group chat (should show up in group only)
                        //agent is in neither (needs to join the group chat)
                        var some_agent_not_in_single = false;
                        for (var i in json.posts) {
                            json.posts[i].foundsingle = false;
                        }
                        $(".chat-single-wrapper").each(function () {
                            //alert("debug: checking:" + $(".chat-single", this).html());
                            var agent = $(".chat-single", this).html();
                            agent = agent.toLowerCase();
                            var found = false;
                            for (var i in json.posts) {
                                if (agent == json.posts[i].from.toString().toLowerCase()) {
                                    json.posts[i].foundsingle = true;
                                    if ((rightnow - lastchattimestamp) > CHATTIMESTAMPTIMEOUT) {
                                        $(".chat-area", $(this).parent().parent()).append('<div class="chat-timestamp">' + now + '</div>');
                                    }
                                    $(this).parent().parent().removeClass("chat-session-active").addClass("chat-session-newmessage");
                                    found = true;
                                    break;
                                }
                            };
                        });
                        for (var i in json.posts) {
                            if (!json.posts[i].foundsingle) {
                                some_agent_not_in_single = true;
                                break;
                            }
                        }

                        var some_agent_in_group = false;
                        for (var i in json.posts) {
                            if ($('#chatparties option[value="' + json.posts[i].from.toString() + '"]').length > 0) {
                                $('#chatparties option[value="' + json.posts[i].from.toString() + '"]').each(function () {
                                    if ($(this).attr("selected") == "selected") {
                                        some_agent_in_group = true;
                                    }
                                });
                                break;
                            }
                        }
                        if (some_agent_not_in_single || some_agent_in_group) {
                            if ((rightnow - lastchattimestamp) > CHATTIMESTAMPTIMEOUT) {
                                $(".chat-area-group").append('<div class="chat-timestamp">' + now + '</div>');
                            }
                            $(".chat-area-group").parent().removeClass("chat-session-active").addClass("chat-session-newmessage");

                        }
                        lastchattimestamp = rightnow;

                        //var lastchattimestamp = 0;
                        //var CHATTIMESTAMPTIMEOUT = 1000 * 15; //15 seconds (change to 5 minutes).
                        var meetinginvitations = false;
                        for (var i in json.posts) {
                            if (json.posts[i].suspend) {
                                suspendpolling(json.posts[i].suspend);
                            }
                            else {
                                var webrtc = false;
                                var webrtcshow = false;
                                if (json.posts[i].msg.indexOf("WEBRTC_COM:") >= 0) {
                                    webrtc = true;
                                    var jstr = json.posts[i].msg.substring(json.posts[i].msg.indexOf("WEBRTC_COM:") + "WEBRTC_COM:".length).replace(/\|/g,"\\");
                                    if (jstr.indexOf("offer") > 0) {
                                        webrtcshow = true;
                                        json.posts[i].msg="[Video Connect]";
                                    }
                                    async function sendneg() {
                                        if (videopool.indexOf(json.posts[i].from.toString()) === -1) {
                                            videopool.push(json.posts[i].from.toString());
                                        }                                        
                                        var o = JSON.parse(jstr);
                                        if (o.desc) {
                                            // If you get an offer, you need to reply with an answer.
                                            if (o.desc.type === 'offer') {
                                                await pc.setRemoteDescription(o.desc);
                                                const stream =
                                                    await navigator.mediaDevices.getUserMedia(constraints);
                                                stream.getTracks().forEach((track) =>
                                                pc.addTrack(track, stream));
                                                await pc.setLocalDescription(await pc.createAnswer());
                                                value = "WEBRTC_COM:" + JSON.stringify({desc: pc.localDescription});
                                                a$.ajax({
                                                    type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "chat", cmd: "chatpost", guid: guid, post: value, cps: json.posts[i].from.toString().split(",") /*$(" .chat-parties", $(me).parent().parent()).val()*/ }, dataType: "json", cache: false, error: a$.ajaxerror,
                                                    /* success: chatposted */
                                                });
                                            }
                                            else if (o.desc.type === 'answer') {
                                                await pc.setRemoteDescription(o.desc);
                                            }
                                            else {
                                                console.log('Unsupported SDP type.');
                                            }
                                        }
                                        else if (o.candidate) {
                                            await pc.addIceCandidate(o.candidate);
                                        }
                                    }
                                    sendneg();
                                }
                                if ((!webrtc) || webrtcshow) {
                                    lastmsg = json.posts[i].msg.toString();

                                    lastfrom = json.posts[i].from.toString();
                                    chatlog.push({ time: now, from: json.posts[i].from.toString(), to: $.cookie("TP1Username"), msg: json.posts[i].msg.toString() });
                                    if ($.cookie("TP1Role") != "CSR") {
                                        $('.chat-save').show();
                                    }
                                    if (!json.posts[i].msg.toString().indexOf("[remote]")) iamremote = true;

                                    var agent_in_single = false;
                                    $(".chat-single-wrapper").each(function () {
                                        if (!agent_in_single) {
                                            var agent = $(".chat-single", this).html();
                                            agent = agent.toLowerCase();
                                            if (agent == json.posts[i].from.toString().toLowerCase()) {
                                                $(".chat-area", $(this).parent().parent()).append("<b>" + json.posts[i].from.toString() + ":</b>&nbsp;" + json.posts[i].msg.toString() + "<br />");
                                                try {
                                                    $('.chat-area', $(this).parent().parent()).scrollTop($('.chat-area', $(this).parent().parent())[0].scrollHeight);
                                                }
                                                catch (e) { }
                                                agent_in_single = true;
                                            }
                                        }
                                    });

                                    var agent_in_group = false;
                                    if ($('#chatparties option[value="' + json.posts[i].from.toString() + '"]').length > 0) {
                                        $('#chatparties option[value="' + json.posts[i].from.toString() + '"]').each(function () {
                                            if ($(this).attr("selected") == "selected") {
                                                agent_in_group = true;
                                            }
                                        });
                                    }

                                    if (agent_in_group || (!agent_in_single)) {
                                        $(".chat-area-group").append("<b>" + json.posts[i].from.toString() + ":</b>&nbsp;" + json.posts[i].msg.toString() + "<br />");
                                        $('.chat-area-group').scrollTop($('.chat-area')[0].scrollHeight);
                                    }

                                    if (!agent_in_single) {
                                        //DONE:Add to Chat parties (if they are not already in the list).
                                        if ($('#chatparties option[value="' + json.posts[i].from.toString() + '"]').length > 0) {
                                            //It's here, now select it.
                                            $('#chatparties option[value="' + json.posts[i].from.toString() + '"]').each(function () {
                                                $(this).attr("selected", "selected");
                                            });
                                        }
                                        else {
                                            if ((json.posts[i].fromname != "#ME#") && (json.posts[i].from.toString() != $.cookie("TP1Username"))) {
                                                $("#chatparties").append($('<option></option>').val(json.posts[i].from.toString()).html(json.posts[i].fromname.replace(/'/g, '')).attr("selected", "selected"));
                                            }
                                        }
                                    }
                                }

                            }
                            if (json.posts[i].msg.indexOf("meeting-join") >= 0) meetinginvitations = true;
                        }
                        $("#chatparties").trigger("liszt:updated");
                        if (meetinginvitations) {
                            $(".meeting-join").unbind().bind("click", function () {
                                var joinmeeting = true;
                                var portback = "https://azschool.trainingroom.us:3000/login?userid=" + $.cookie("TP1Username") + "&room=" + $(this).attr("room");
                                if ($.cookie("TP1Role") != "CSR") {
                                    portback += "&leadertoken=arrrrsdadf5552332";
                                }
                                if ($("#MeetIframe").attr("src") != "") {
                                    if ($("#MeetIframe").attr("src") != portback) {
                                        if (!confirm("Would you like to abandon the current meeting and join a new one?")) {
                                            joinmeeting = false;
                                        }
                                    }
                                }
                                if (joinmeeting) {
                                    if ($("#MeetIframe").attr("src") != portback) {
                                        $("#MeetIframe").attr("src", portback).show();
                                    }
                                }
                                $(".meet-message").hide();
                                $("#meettab").show();
                                $("#meetlabel").trigger("click");
                                $(".chat-window-close").trigger("click");
                            });
                        }
                    }
                }
                setTimeout('appApmMessaging.pingchat()', CHATPINGDELAY);
                //$(".chat-stats").html(stats);
                if (iamremote) {
                    showlife();
                }
                else if (chatmessagespending) {
                    if ((rightnow - lastchatlifesign) > CHATLIFETIMEOUT) {
                        chatbeep();
                    }
                    else {
                        chatmessagespending = false;
                    }
                }

            }
        }
    }

    function touchchat() {
        CHATPINGDELAY = INCHATDELAY;
        chatlasttouch = (new Date).getTime();
    }

    function setchatindex(me) {
        chatindex = $(me).index();
        $(".chat-session").removeClass("chat-session-active");
        $(me).addClass("chat-session-active").removeClass("chat-session-newmessage");
        $(".chat-talking").prop("checked", false);
        $(" .chat-talking", me).prop("checked", true);
    }

    function bindchatsession(isSubsession) {

        if (!isSubsession) {
            $(".chat-returnline").unbind().bind("focus", function () {
                //??setchatindex($(this).parent().parent());
                touchchat();
                showlife();
                $(" .chat-inputline", $(this).parent()).first().focus();
                //$("#inputline").focus();
            });
            $(".chat-inputline").unbind().bind("focus", function () {
                //??setchatindex($(this).parent().parent());
            }).bind("keypress", function (ev) {
                touchchat();
                chatloopcount = 0;
                showlife();
                if (window.event && window.event.keyCode == 13) {
                    $(this).trigger("change");
                } else if (ev && ev.keyCode == 13) {
                    $(this).trigger("change");
                }
            }).bind("change", function () {
                var me = this;
                touchchat();
                showlife();
                //TODO: Transmit this to be displayed in the other person(s) chat box(es).
                if (blurring) {
                    blurring = false;
                    $(".chat-parties").last().focus();
                    return;
                }

                var value = $(me).val();
                value = value.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\\/g, "|");
                var cps = "";
                $(" .chat-parties", $(me).parent().parent()).each(function () {
                    var talking = $(" .chat-talking", $(this).parent().parent()).prop("checked");
                    var cp = $(this).val();
                    //alert("debug: talking = " + talking + " for cp = " + cp);
                    if (talking) {
                        if (cp == null) {
                            $(" .chat-talking", $(this).parent().parent()).prop("checked", false);
                        }
                        else if (cp != "") {
                            if (cps != "") {
                                cps += ",";
                            }
                            cps += cp;
                        }
                    }
                });
                $(" .chat-single", $(me).parent().parent()).each(function () {
                    var talking = $(" .chat-talking", $(this).parent().parent()).prop("checked");
                    var cp = $(this).html();
                    //alert("debug: talking = " + talking + " for cp = " + cp);
                    if (talking) {
                        if (cp != "") {
                            if (cps != "") {
                                cps += ",";
                            }
                            cps += cp;
                        }
                    }
                });

                if (cps == "") {
                    alert("No person(s) selected");
                    NOBODYSELECTED = true;
                    blurring = true;
                    $(me).blur();
                    return;
                }

                //alert("debug: old style:" + $(" .chat-parties", $(me).parent().parent()).val());
                //alert("debug: mew style:" + cps);
                if (false) { //($.cookie("TP1Role") == "Admin") { //debug to bypass actual posting
                    //alert("debug: simulating sending to chat parties2: " + cps);
                    chatposted({});
                }
                else {
                    if (value == "video") {
                        if (ready_to_offer) {
                            async function sendoffer() {
                                value = "WEBRTC_COM:";
                                try {
                                    await pc.setLocalDescription(await pc.createOffer());
                                    // send the offer to the other peer
                                    value += JSON.stringify({desc: pc.localDescription});
                                    a$.ajax({ //Changed 2018-12-07
                                        type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "chat", cmd: "chatpost", guid: guid, post: value, cps: cps.split(",") /*$(" .chat-parties", $(me).parent().parent()).val()*/ }, dataType: "json", cache: false, error: a$.ajaxerror,
                                        success: chatposted
                                    });
                                } catch (err) {
                                    console.error(err);
                                }
                            }
                            sendoffer();
                        }
                        else {
                            alert("debug: Offer Not Ready");
                        }
                    }
                    else {
                        a$.ajax({ //Changed 2018-12-07
                            type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "chat", cmd: "chatpost", guid: guid, post: value, cps: cps.split(",") /*$(" .chat-parties", $(me).parent().parent()).val()*/ }, dataType: "json", cache: false, error: a$.ajaxerror,
                            success: chatposted
                        });
                    }
                }
                function chatposted(json) {
                    if (a$.jsonerror(json)) {
                    }
                    else {
                    }
                }
                var rightnow = (new Date).getTime();
                var now = new Date;
                chatlog.push({ time: now, from: $.cookie("TP1Username"), to: cps, msg: $(me).val() });
                $(".chat-area").each(function () {
                    var talking = $(" .chat-talking", $(this).parent()).prop("checked");
                    if (talking) {
                        if ((rightnow - lastchattimestamp) > CHATTIMESTAMPTIMEOUT) {
                            $(this).append('<div class="chat-timestamp">' + now + '</div>');
                        }
                        var bld = "<b>" + $.cookie("TP1Username") + ":</b>&nbsp;";
                        /*
                        if (chat20ui) { //debug
                        bld += "[simulated] ";
                        }
                        */
                        var intercept = $(me).val();
                        if (intercept.indexOf("meeting-join") > 0) {
                            intercept = "[Meeting Invitation Sent]";
                        }
                        bld += intercept + "<br />";
                        $(this).append(bld);
                        $(this).scrollTop($(this)[0].scrollHeight);
                    }
                });
                lastchattimestamp = rightnow;

                if ($.cookie("TP1Role") != "CSR") {
                    $('.chat-save').show();
                }
                $(this).val("");

            });
        }
        $(".chat-session-close").unbind().bind("click", function () {
            numsessions -= 1;
            $(this).parent().remove();
            chatindex = 0;
            clickedchatbubble();
        });

        $(".chat-area").unbind().bind("click", function () {
            setchatindex($(this).parent());
            //alert("debug: chatindex = " + chatindex);
        });


    }

    function chatbeep() {
        $(".chat-beep-icon").show();

        if (!$(".chat-mute input").is(":checked")) {
            var sound = document.getElementById("beep");
            try {
                sound.Play();
            } catch (e) { }
        }
        /*
        //Just try the simplest approach first - It doesn't uncover the windwo, but if you're in another IE tab it will!
        alert("Acuity: Incoming Chat from " + lastfrom);
        touchchat();
        */
        //Now, try opening a fresh window
        //window.open("chatalert.aspx", "_blank"); //The alert box only comes to the front on the FIRST useage.
        /*
        //THIS WORKS - Only RELEASE when pop-ups have been enabled for ers.acuityapmr.com
        window.open("chatalert.aspx?from=" + lastfrom + "&msg=" + lastmsg, "acn_" + Math.floor((Math.random() * 1000000) + 1));
        chatmessagespending = false;
        */
    }

    function showlife() {
        $(".chat-beep-icon").hide();
        lastchatlifesign = (new Date).getTime();
        chatmessagespending = false;
    }

    function bldChatWindow(o) {
        //Return if already there
        var alreadythere = false;
        $(".chat-single").each(function () {
            if (o.chatWith.val == $(this).html()) {
                alreadythere = true;
            }
        });
        if (alreadythere) return "";
        var bld = '<div class="chat-session"><div class="chat-session-close">X</div>';
        bld += '<div class="chat-select">';
        bld += '<input class="chat-talking" type="checkbox"';
        if (a$.exists(o.chatWith)) {
            if (o.chatWith.select) {
                bld += ' checked="checked"';
            }
        }
        bld += ' />';
        if (!a$.exists(o.chatWith)) {
            bld += '<div class="chat-chosenbox"><select data-placeholder="Chat with Team Members currently online..." class="chat-parties">';
            /*
            bld += '<option value="' + o.chatWith.val + '">' + o.chatWith.text + '</option>';
            }
            */
            bld += '</select></div>'
        }
        else {
            bld += '<div class="chat-single-wrapper">';
            if (o.chatWith.online) {
                bld += '<span class="chat-online chat-online-yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
            }
            else {
                bld += '<span class="chat-online chat-online-no">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
            }
            bld += '<span class="chat-singlename">' + o.chatWith.text + '</span><span class="chat-single">' + o.chatWith.val + '</span></div>';
        }
        bld += '</div>';
        bld += '<div class="chat-area">';
        bld += '</div>';
        //bld += '<div class="chat-send">' + $.cookie("TP1Username") + ':&nbsp;<input class="chat-inputline" type="text"/>';
        //bld += '<input class="chat-returnline" type="text" style="border:0;width:0px"/></div>';
        bld += '</div>';
        return bld;
    }

    function addsingle(csr, csrtext) {
        //Using the wrapper, be sure not to add members who are already there.
        var online = false;
        for (var i in lastchatees.chatees) {
            if (csr == lastchatees.chatees[i].uid) {
                online = true;
                break;
            }
        }
        var found = false;
        $(".chat-single-wrapper").each(function () {
            if (!found) {
                //alert("debug: checking:" + $(".chat-single", this).html());
                var agent = $(".chat-single", this).html();
                agent = agent.toLowerCase();
                if (agent == csr) {
                    found = true;
                }
            }
        });

        if (!found) {
            //alert("debug: csr=" + csr);
            //TODO: Be sure the person isn't already selected for chat in another window.
            //TODO: Compare the CSR box with the chat with list to be sure the person is logged in (if not logged in, put that somewhere too).
            numsessions += 1;
            clickedchatbubble();
            var bld = bldChatWindow({ chatWith: { text: csrtext, val: csr, online: online, select: true} });
            $(".chat-sessions").prepend(bld);
            //chatlistinit(false);
            bindchatsession(true);
        }
    }

    function exists(me) {
        return (typeof me != 'undefined');
    }


    // global variables
    window.appApmMessaging = {
        getmessages: getmessages,
        pollmessages: pollmessages,
        pingchat: pingchat,
        longpoller: longpoller,
        composecontacts: composecontacts,
        killactionscraper: killactionscraper,
        getsup_name: getsup_name,
        getsup_username: getsup_username,
        getmgr_name: getmgr_name,
        getmgr_username: getmgr_username,
        getmgr_cnt: getmgr_cnt,
        getsup_cnt: getsup_cnt,
        clickedchatbubble: clickedchatbubble,
        issuepollingsuspension: issuepollingsuspension,
        pollfailsafe: pollfailsafe,
        pingfailsafe: pingfailsafe,
        testerror: testerror
    };

//Begin WebRTC Experiment
async function getlocal() {
    await pc.setLocalDescription(await pc.createOffer());
    console.log("debug: localDescription: " + JSON.stringify({desc: pc.localDescription}));
    //signaling_send({desc: pc.localDescription});
}

async function signaling_send(o) {
    if (videopool.length > 0) {
        var cvalue = "WEBRTC_COM:" + JSON.stringify(o);
        a$.ajax({
            type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "chat", cmd: "chatpost", guid: guid, post: cvalue, cps: videopool /*$(" .chat-parties", $(me).parent().parent()).val()*/ }, dataType: "json", cache: false, error: a$.ajaxerror,
            /* success: chatposted */
        });
    }
    /*
    console.log("debug: Calling Signaling: " + JSON.stringify(o));
    const result = await $.ajax({
        type: "POST", //TODO: You'll need the url and credentials (maybe no credentials since pingchat)
                     //TODO: Also, this is really the longpoller, possibly.
        async: true,
        service: "JScript",
        data: { lib: "chat", cmd: "pingchat", managed: MANAGELEVEL, urlprefix: a$.urlprefix(), guid: guid, devmode: ($("#StgInjDev select").val() == "On") },
        dataType: "json",
        cache: false
    });
    receivesignal(result);
    */
}

async function receivesignal(o) { //signaling.onmessage = async ({desc, candidate}) => {
  try {
    //Moved up into pingchat
    /*
    if (o.desc) {
      // If you get an offer, you need to reply with an answer.
      if (o.desc.type === 'offer') {
        await pc.setRemoteDescription(o.desc);
        const stream =
          await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach((track) =>
          pc.addTrack(track, stream));
        await pc.setLocalDescription(await pc.createAnswer());
        signaling_send({desc: pc.localDescription});
      }
      else if (o.desc.type === 'answer') {
        await pc.setRemoteDescription(o.desc);
      }
      else {
        console.log('Unsupported SDP type.');
      }
    }
    else if (candidate) {
      await pc.addIceCandidate(candidate);
    }
    */
  } catch (err) {
    console.error(err);
  }
}    

// handles JSON.stringify/parse
//const signaling = new MySignalingChannel();
const constraints = {video: true};
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const pc = new RTCPeerConnection(configuration);

var selfView;
var remoteView;

var ready_to_offer = false;

// Send any ice candidates to the other peer.
pc.onicecandidate = ({candidate}) => signaling_send({candidate});

// Let the "negotiationneeded" event trigger offer generation.
pc.onnegotiationneeded = async () => {
  ready_to_offer = true;
  try {
    await pc.setLocalDescription(await pc.createOffer());
    // send the offer to the other peer
    signaling_send({desc: pc.localDescription});
  } catch (err) {
    console.error(err);
  }
};

// After remote track media arrives, show it in remote video element.
pc.ontrack = (event) => {
  // Don't set srcObject again if it is already set.
  //alert("debug:setting remote view");
  remoteView.srcObject = event.streams[0];
  if ('srcObject' in remoteView) {
      remoteView.srcObject = event.streams[0];
  } else {
      // Avoid using this in new browsers, as it is going away.
      remoteView.src = URL.createObjectURL(event.streams[0]);
  }
  remoteView.autoplay="autoplay";
  /*
  if (remoteView.srcObject) return;
  remoteView.srcObject = event.streams[0];
  */
};

// Call start() to initiate.
async function videostart() {
  try {
    // Get local stream, show it in self-view, and add it to be sent.
    const stream =
      await navigator.mediaDevices.getUserMedia(constraints);
    stream.getTracks().forEach((track) =>
      pc.addTrack(track, stream));
    selfView.srcObject = stream;
    if ('srcObject' in selfView) {
        selfView.srcObject = stream;
    } else {
        // Avoid using this in new browsers, as it is going away.
        selfView.src = URL.createObjectURL(stream);
    }
    selfView.autoplay="autoplay";

    //getlocal();
  } catch (err) {
    console.error(err);
  }
}

/*
signaling.onmessage = async ({desc, candidate}) => {
  try {
    if (desc) {
      // If you get an offer, you need to reply with an answer.
      if (desc.type === 'offer') {
        await pc.setRemoteDescription(desc);
        const stream =
          await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach((track) =>
          pc.addTrack(track, stream));
        await pc.setLocalDescription(await pc.createAnswer());
        signaling.send({desc: pc.localDescription});
      } else if (desc.type === 'answer') {
        await pc.setRemoteDescription(desc);
      } else {
        console.log('Unsupported SDP type.');
      }
    } else if (candidate) {
      await pc.addIceCandidate(candidate);
    }
  } catch (err) {
    console.error(err);
  }
};
*/






//End WebRTC Experiment

})();


