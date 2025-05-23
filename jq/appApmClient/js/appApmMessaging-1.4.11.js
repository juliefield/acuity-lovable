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
/*

*/

(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    var typeWriter = new Audio("/images/578786__nomiqbomi__bleep-2.mp3");

    var holdvalue = "";

    var NOBODYSELECTED = false;

    var OV_chat_off = false;
    var OV_msg_ro = false;
    var beenproject = "";

    var T_C = false;

    var sto; //For subtracktime timeout.

    //TODO: Open a new single, with the chat group, the new message will be in there.
    var tml = 0; //Time Limit
    if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "test-km2.")) {
        T_C = true;
        tml = 80; // 1 hr + 20 min bonus.
        if (false) { //(a$.gup("weektest") == "1") {
            tml = 7 * 24 * 60;
        }
        //tml = 0; //TEST
    }

    var bonusids = [];
    function subtractTime() {
        showmax = false;
        $(".dchatstamp").each(function() {
            var sec = parseInt($(this).attr("seconds"),10);

            /* OLD WAY
            if (a$.gup("timefactor") != "") {
                sec -= parseInt(a$.gup("timefactor"),10);
            }
            else {
                sec -= 1;
            }

            $(this).attr("seconds","" + sec);
            */
            //NEW WAY
            var tb = parseInt($(this).attr("timebase"),10);
            var secdif = (Date.now() - tb) / 1000;
            if  ((a$.urlprefix(true).indexOf("mnt") == 0) && (a$.gup("timefactor") != "")) {
                sec -= (secdif * parseInt(a$.gup("timefactor"),10))
            }
            else {
                sec -= secdif;
            }
            sec = Math.floor(sec);

            var dsec = 0.0 + sec;

            if (sec <= -1200) {
                //$(this).html("**DELETE**");
                $(this).parent().next().remove();
                $(this).parent().remove();
                for (var b=0; b < bonusids.length; b++) {
                    if (bonusids[b] == $(this).attr("disid")) {
                        bonusids.splice(b,1);
                        break; 
                    }
                }
            }
            else { //if (sec <= 1200) {
                var bonusfound = false;
                for (var b=0; b < bonusids.length; b++) {
                    if (bonusids[b] == $(this).attr("disid")) {
                        bonusfound = true;
                    }
                }
                if (!bonusfound) {
                    if (sec <= 300) showmax = true;
                    if (sec <= 0) {
                        $(this).parent().next().hide();
                        $(this).parent().hide();
                    }
                    else {
                       var bld = '<span style="font-weight:bold;">';
                       if (sec > 86400) {
                          var days = Math.floor(dsec / 86400.0);                          
                          bld += "(" + days + " Day" + ((days > 1)?"s":"");
                       }
                       else {
                           bld += "(" + Math.floor(dsec / 60.0) + " Minutes, " + (sec % 60) + " Seconds";
                       }
                       bld += " until Deletion)</span>";
                       $(this).html(bld);
                        $(this).parent().next().show();
                        $(this).parent().show();
                    }
                }
                else {
                    var bsec = 1200;
                    if (sec < 0) {
                        bsec = 1200 + sec;
                        sec = 0;
                    }
                    bdsec = 0.0 + bsec;
                    var bt = '<span style="font-weight:bold;color:blue;">extra time: ' + Math.floor(bdsec / 60.0) + " min " + ((bsec == 1200)?"" : " " + (bsec % 60) + " sec") + "</span>";

                    dsec = 0.0 + sec;
                    var bld = "";
                    if (sec == 0) {
                        bld = '<span style="font-weight:bold;">' + "(pending deletion) " + bt + "</span>";
                    }
                    else {
                        bld = '<span style="font-weight:bold;">' + "(" + Math.floor(dsec / 60.0) + " Minutes, " + (sec % 60) + " Seconds until Deletion) " + bt + "</span>";
                    }
                    $(this).html(bld);
                    $(this).parent().next().show();
                    $(this).parent().show();
                }
            }
            /*
            else {
               var bld = '<span style="font-weight:bold;">' + "(" + Math.floor(dsec / 60.0) + " Minutes, " + (sec % 60) + " Seconds until Deletion)</span>";
               $(this).html(bld);
            }
            */
        });
        if (showmax) {
            $(".chat-max-time").show();
        }
        else {
            $(".chat-max-time").hide();
        }
        sto = setTimeout(subtractTime,1*1000);
    }
    if (T_C) {
        subtractTime();
    }

    if (a$.urlprefix() == "chime.") {
        a$.ajax({
            type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "spine", cmd: "appledetect", userid: $.cookie("TP1Username") }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: function(json) {
                if (a$.jsonerror(json)) {
                    OV_chat_off = true;
                    OV_msg_ro = true;
                }
                else {
                    if (json.isapple) {
                        OV_chat_off = true;
                        OV_msg_ro = true;
                    }
                }
                if (OV_chat_off) {
                    $("#chat_div").remove();
                    $("#chatbox_li").remove();
                    if (OV_msg_ro) {
                        $(".messages-compose").remove();
                    }
                    /*
                    try { $(".headericon-chat").eq(1).remove(); } catch(e){};
                    try { $(".headericon-chat").eq(0).remove(); } catch(e){};
                    */
                }
            }
        });

        function keepcomoff() {
          if (OV_chat_off) {
            $("#chat_div").remove();
            $("#chatbox_li").remove();
          }
          if (OV_msg_ro) {
            $(".messages-compose").remove();
            if ($("#selProjects").val() != "95") {
                $("#selProjects").val("95");
                try { $("#selProjects").trigger("change"); } catch(e) {};
                try { $("#selProjects").trigger("liszt:updated"); } catch(e) {};
            }
            else {
                beenproject="95";
            }
            try {
              var r1 = 0;
              if ($("#selProjects option").length > 1) {
                  $("#selProjects option").each(function() {
                    if (!r1) {
                        if ($(this).attr("value") != "95") {
                            $(this).remove();
                            try { $("#selProjects").trigger("change"); } catch(e) {}; //To change all subordinate boxes.
                            try { $("#selProjects").trigger("liszt:updated"); } catch(e) {};
                            r1 = 1;
                        }
                    }
                  });
              }
            }
            catch(e) {}
            try {  
                if ((beenproject == "95") && ($("#selProjects").val() != "95")) {
                    window.location = "https://chime.acuityapm.com/logout.aspx"; //Failsafe                                       
                }
            } catch(e) {};

          }
          setTimeout(keepcomoff,500);
        }
        keepcomoff();
    }

    
    var popoutnum = 1;
    var flygrpnum = 0;
    var prevunread = 0;
    var mutebeep = false;

    var is_sme = false; //2022-10-24: KM2-specific type of agent, should have the same chat privileges as a Team Leader.

    var timeouts = [0, 0, 0]; //0=msg short, 1= msg failsafe, 2=msg long
    function ctimeout(n) {
        if (timeouts[n] != 0) {
            clearTimeout(timeouts[n]);
            timeouts[n] = 0;
        }
    }


    var A = []; //For easy local storage of arrays with eval functions.
    var O = {}; //For easy local storage of an object with eval functions.
    var MANAGELEVEL = 0;

    var chatindex = 0;
    var saved_chatparties = "";

    var chat20ui = false;

    var chatlog = [];

    var numsessions = 1;

    var lastchatees = {};

    var LOADCOUNT = 100;

    var LASTMSGID = 0;
    var MESSAGEPOLLDELAY = 1000 * 60; //ONE MINUTE now.

    var LONGPOLLERINTERVAL = 500; //Every half second
    var LONGPOLLEROVERRIDE = false; //Keeps short polling timeouts from being repeatedly set.
    var LONGPOLLER_WITH_BACKUP = false; //For testing poller service without relying on it.
    var LONGPOLLER_LOCKOUT = false;

    var OUTOFCHATDELAY = 1000 * 10; //10 seconds
    var INCHATDELAY = 1000 * 3; //3 seconds
    var CHATPINGDELAY = OUTOFCHATDELAY;

    var CHATIDLETIMEOUT = 1000 * 30; //60 seconds
    var chatlasttouch;
    var lastchatix = 0;

    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    var FILTERCHECKINTERVAL = 1000 * 60;
    var FILTERWARNING = 0; //Allow 1 warning prior to reloading.
    function filtercheck() {
        var badfilters = false;
        //alert("debug1b: filter status:" + $("#loader_filters").html());
        if ($("#loader_filters").html() != "CONFIRMED") badfilters = true; //Insufficient for partial loadings
        //alert("debug: csr text = " + $("#selCSRs option:selected").text());
        //2022-06-06 - Special preventions while searching for loading issue.
        if ($("#selProjects option:selected").text() == "..loading") badfilters = true;
        if ($("#selLocations option:selected").text() == "..loading") badfilters = true;
        if ($("#selGroups option:selected").text() == "..loading") badfilters = true;
        if ($("#selTeams option:selected").text() == "..loading") badfilters = true;
        if ($("#selCSRs option:selected").text() == "..loading") badfilters = true;

        if (!badfilters) {
            FILTERWARNING = 0;
        }
        else {
            if (FILTERWARNING >= 2) location.reload();
            FILTERWARNING += 1;
            a$.ajax({
                type: "POST" /*POST*/, service: "JScript", async: true, data: { cmd: "saveerror", error: "Filter Load Failure Stage-" + FILTERWARNING }, dataType: "json", cache: false, error: a$.ajaxerror
            });
        }
        setTimeout('appApmMessaging.filtercheck()', FILTERCHECKINTERVAL);

    }
    setTimeout('appApmMessaging.filtercheck()', FILTERCHECKINTERVAL);


    var lastchatlifesign = 0;
    var chatmessagespending = false;
    var CHATLIFETIMEOUT = 1000 * 15; //15 seconds

    var Team = "";
    var Role = "";

    function affirmTeamLinkDisplay() {
        //if ($.cookie("TP1Role") != "Admin") return; //debug
        /* OBSOLETE
        if (Role == "CxSR") {
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
        */
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function updatetitle() {
        var cnt = 0;
        var h = "";
        if ($(".chat-badge-unread").css("display") != "none") {
            h = $(".chat-badge-unread").html();
            if (isNumeric(h)) cnt += parseInt(h, 10);
        }
        if ($(".messages-badge-unread").css("display") != "none") {
            h = $(".messages-badge-unread").html();
            if (isNumeric(h)) cnt += parseInt(h, 10);
        }
        if (document.title.toString().indexOf(") ") > 0) {
            document.title = document.title.toString().split(") ")[1];
        }
        if (cnt > 0) {
            // document.title += " - (" + cnt + ")";
            let docTitle = "(" + cnt + " unread)" + ' ' + document.title;
            document.title = docTitle;
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
    var dist = {};
    dist.groups = [];

    var pollingsuspended = false;
    var pollsuspensiontimestamp = 0;
    var POLLSUSPENSIONDELAY = 1000 * 60 * 1; //1 minutes

    //fail-safe
    var CHATPINGTESTINTERVAL = 1000 * 60 * 6; //6 minutes (still a long time)
    var CHATPINGTIMEOUT = 1000 * 60; //60 seconds

    var MESSAGEPOLLTESTINTERVAL = 3000 * 60; //3 MINUTES
    var MESSAGEPOLLTIMEOUT = 5000 * 60; //FIVE MINUTES.
    var lastpingtimestamp = 0;
    var lastpolltimestamp = 0;

    function pollfailsafe() {
        var rn = (new Date).getTime();
        ctimeout(1);
        timeouts[1] = setTimeout('appApmMessaging.pollfailsafe()', MESSAGEPOLLTESTINTERVAL);
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
        if (((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) && ($.cookie("TP1Role") == "CxSR")) {
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

                if (true) { //2021-08-23 - ALL USING LONG POLLER  ((a$.urlprefix() == "g2.") //Testing Dev
                    //|| ((a$.urlprefix(true) == "mnt.") && (a$.urlprefix() != "chime.")) //Testing Staging (leave Chime as a short-polling comparator)
                    //|| ((a$.urlprefix(true) != "mnt.") /* && (a$.urlprefix() != "chime.") */)  //Live Testing 
                    //) {

                    LONGPOLLEROVERRIDE = true;

                    if (false) { //(!((a$.urlprefix() == "g2.") /* || (a$.urlprefix(true) == "mnt.") */)) { //Live Site
                        LONGPOLLER_WITH_BACKUP = true;
                        /*
                        MESSAGEPOLLDELAY = 1000 * 60 * 2; //TWO MINUTES (easing off)  
                        MESSAGEPOLLTESTINTERVAL = 1000 * 60 * 4; //4 minutes 
                        MESSAGEPOLLTIMEOUT = 1000 * 60 * 6; //6 minutes 
                        */
                    }
                    else {
                        MESSAGEPOLLDELAY = 1000 * 60 * 10000; //Forever (affectively disabled)
                        MESSAGEPOLLTESTINTERVAL = 3000 * 60 * 10000; //Forever (affectively disabled)
                        MESSAGEPOLLTIMEOUT = 5000 * 60 * 10000; //Forever (affectively disabled)

                        OUTOFCHATDELAY = 1000 * 60; //60 seconds (to keep "online" alive)
                        INCHATDELAY = 1000 * 60; //60 seconds (to keep "online" alive)
                        CHATPINGDELAY = OUTOFCHATDELAY;
                    }
                    /*
                    if (a$.urlprefix() == "g2.") {
                        $(".poller-debug").show();
                    }
                    */
                    if (a$.urlprefix(true) == "mnt-nathan.") { //WSC DEBUG
                        $(".wsc-debug").show();
                    }
                    $(".longpoller-active").show();
                    $("#poller_client").html(msg.idclient);
                    $("#poller_userid").html($.cookie("TP1Username"));
                    $("#poller_idusr").html(msg.idusr);
                    $("#poller_idlastmsg").html(LASTMSGID);
                    $("#poller_message_com").html("READY");
                    $("#poller_nav_com").html("");
                    $("#poller_chat_com").html("");
                    ctimeout(2);
                    timeouts[2] = setTimeout('appApmMessaging.longpoller()', LONGPOLLERINTERVAL);
                }

                if ((!LONGPOLLEROVERRIDE) || LONGPOLLER_WITH_BACKUP) {  //Fire up the short poller
                    ctimeout(1);
                    timeouts[1] = setTimeout('appApmMessaging.pollfailsafe()', MESSAGEPOLLTESTINTERVAL);
                    ctimeout(0);
                    timeouts[0] = setTimeout('appApmMessaging.pollmessages()', MESSAGEPOLLDELAY);
                }

                if (true) { //WSC
                    $(".wsc-active").show(); //1st orange dot.
                    $("#wsc_client").html(msg.idclient);
                    $("#wsc_userid").html($.cookie("TP1Username"));
                    $("#wsc_idusr").html(msg.idusr);
                    $("#wsc_idlastmsg").html(LASTMSGID);
                    //$("#wsc_message_com").html("READY");
                    appApmSignal.init();
                }
            }

            if (a$.urlprefix() == "da.") {
                if ($.cookie("TP1Role") == "CSR") {
                    $(".messages-compose").hide();
                }
            }

            $(".messages-compose input").bind("click", function () {
                if (OV_msg_ro) { alert("message compose disabled"); return false; };
                $('#messagetab').show();
                $('#messageareaACK').hide();
                $('#messagearea').show();

                $('#messageslabel').trigger('click');
                var bld = '<div class="message-compose" style="position:relative">';
                bld += '<span class="message-compose-caption">Compose Message</span>';
                bld += '<div class="message-deliverymethod-wrapper" style="position:absolute;top:5px;left:550px;display:none;">Delivery Method: <select class="message-delivery-method"><option value="1">Acuity Message</option><option value="2">External Email</option><option value="5">Banner</option></select></div>';
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
                bld += '<div class="message-compose-message">Message: <div id="composebody" contenteditable="true" class="message-div-compose-body"/></div>';
                bld += '<div class="message-acknowledgement-wrapper">Require Acknowledgement: <input class="message-acknowledgement-checkbox" type="checkbox" value="Yes" /><br /><br />';
                bld += '<div class="message-acknowledgement-prompt-wrapper" style="display:none;">Acknowledgement Prompt: <div id="composeprompt" contenteditable="true" class="message-div-compose-prompt">Please acknowledge this message.</div></div>';

                if ((a$.urlprefix() == "collective-solution.") || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "walgreens.") || (a$.urlprefix() == "ultracx.")    /* && ($.cookie("TP1Role") == "Admin") */) {
                    bld += '<div style="display:block;text-align: right;line-height:30px;">';
                    bld += '<span class="attachments-list"></span>';

                    bld += '<input id="msgFileUpload" name="msgFileUpload" type="file" accept=".doc,.docx,.xls,.xlsx,.pdf" style="display:none;">';
                    bld += '<input type="button" value="Attach File..." onclick="document.getElementById(';
                    bld += "'msgFileUpload'";
                    bld += ').click();return false;" style="margin-left: 30px;">';
                    bld += '</div>';
                }

                bld += '</div>';

                bld += '<div class="message-compose-send" style="float: left;"><input type="button" value="Send Message"/>';
                bld += '</div>';
                $('#messagearea').html(bld);


                var keyguid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

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
                    //New column in qa_attachment: keyguid, use your local guid for this (remove it once connected to idmeb).
                    var url = loc + "jshandler.ashx?username=" + a$.xss($.cookie("username")) + "&uid=" + a$.xss($.cookie("uid")) + "&lib=qa&cmd=saveAttachment&keyguid=" + keyguid + "&filename=" + fn + "&database=C";

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
                        $(".attachments-list").append('  <a href="#" class="attachment-download" atid="' + json.id + '">' + fn + '</a>');
                        setupDownload();
                    });
                });

                if (a$.urlprefix(true).indexOf("mnt") == 0) {
                    $(".message-deliverymethod-wrapper").show();
                }

                $(".message-acknowledgement-checkbox").bind("click", function () {
                    if ($(this).is(':checked')) {
                        $(".message-acknowledgement-prompt-wrapper").show();
                    }
                    else {
                        $(".message-acknowledgement-prompt-wrapper").hide();
                    }
                });

                $(".message-delivery-method").bind("change", function () {
                    if ($(this).val() == "1") {
                        $(".message-acknowledgement-wrapper").show();
                    }
                    else {
                        $(".message-acknowledgement-wrapper").hide();
                    }
                });

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
                    if ($(".message-delivery-method").val() != "1") {
                        alert("debug: Non-Internal Delivery Methods are not yet allowed.");
                        return;
                    }

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

                    //alert("debug: tostr=" + tostr); return; //duck

                    a$.ajax({
                        type: "POST", async: true, data: { cmd: "messagesend", to: tostr, read: "Y", subject: subject, body: value,
                            deliverymethod: $(".message-delivery-method").val(),
                            acknowledgementRequired: $(".message-acknowledgement-checkbox").is(':checked') ? "Yes" : "No",
                            acknowledgementPrompt: $("#composeprompt").html(),
                            keyguid: keyguid //TODO: For reconciling attachments.
                        }, dataType: "json", cache: false, error: a$.ajaxerror,
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
                            if ((!LONGPOLLEROVERRIDE) || LONGPOLLER_WITH_BACKUP) {
                                lastpolltimestamp = 0;
                                pollmessages();
                            }
                        }
                    };
                    //Added 2020-07-28 as a bandaid.
                    if (!OV_msg_ro) $(".messages-compose input").trigger("click");
                    $('#messagetab').show();
                    $('#graphlabel').trigger('click');
                });
                composecontacts();
            });
            showmessagebox("Inbox", true);
        }
        if (a$.urlprefix() == "km2.") {
            //2022-10-24 - Special call needed to determine if the agent is an SME before initializing (the first "special com attribute" other than role).
            a$.ajax({
                type: "POST", service: "JScript", async: true, data: { lib: "chat", cmd: "getSpecialComAttributes" }, dataType: "json", cache: false, error: a$.ajaxerror,
                success: gotspecialcomattributes
            });
            function gotspecialcomattributes(json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    is_sme = json.attributes.sme;
                    initchatwindow();
                }
            }
        }
        else {
            initchatwindow();
        }
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
            if (!LONGPOLLER_LOCKOUT) {
                pollmessages();
            }
            LONGPOLLER_LOCKOUT = true;
        }
        else {
            ctimeout(2);
            timeouts[2] = setTimeout('appApmMessaging.longpoller()', LONGPOLLERINTERVAL);
        }
        if ($("#poller_nav_com").html() != "") {
            var navcom = $("#poller_nav_com").html();
            $("#poller_nav_com").html("");
            //alert("debug: 3 navcom received:" + navcom);
            var nc = JSON.parse(navcom);
            if (nc.type == "FlexGame") {
                var myframe = $(".fan-flex-game-listing iframe").eq(0);
                //if ($(myframe).attr("src") == "") {
                $(myframe).attr("src", "../../3/ng/AgameFlex/userGameListing.aspx?prefix=" + a$.urlprefix().split(".")[0] + "&gameid=" + nc.gameid);
                //}
                $("#fantab").show();
                $("#fanlabel").trigger("click");
                var foundflex = false;
                $(".fan-menu a").each(function () {
                    if (!foundflex) {
                        try {
                            if ($("span", this).html() == "FLEX") {
                                foundflex = true;
                                $(this).trigger("click");
                            }
                        } catch (e) { }
                    }
                });
                if (!foundflex) alert("flex tab not found");
            }
            else if (nc.type == "WagerBook") {
                var myframe = $(".fan-wager-book iframe").eq(0);
                //if ($(myframe).attr("src") == "") {
                $(myframe).attr("src", "../../3/ng/AgameLeague/AGameWager.aspx?prefix=" + a$.urlprefix().split(".")[0] + "&gameid=" + nc.gameid);
                //}
                $("#fantab").show();
                $("#fanlabel").trigger("click");
                var foundflex = false;
                $(".fan-menu a").each(function () {
                    if (!foundflex) {
                        try {
                            if ($("span", this).html() == "Wager") {
                                foundflex = true;
                                $(this).trigger("click");
                            }
                        } catch (e) { }
                    }
                });
                if (!foundflex) alert("wager tab not found");
            }
            else if (nc.type == "PlayerSetup") {
                //alert("debug:Got to player setup");
                $("#fantab").show();
                $("#fanlabel").trigger("click");
                $(".fan-menu a").each(function () {
                    try {
                        if ($("span", this).html() == "Player Setup") {
                            $(this).trigger("click");
                        }
                    } catch (e) { }
                });
            }
            else if (nc.type == "AGameRoster") {
                //alert("debug:Got to player setup");
                $("#fantab").show();
                $("#fanlabel").trigger("click");
                $(".fan-menu a").each(function () {
                    try {
                        if ($("span", this).html() == "Roster") {
                            $(this).trigger("click");
                        }
                    } catch (e) { }
                });
            }
            else if (nc.type == "AGame") {
                $("#fantab").show();
                $("#fanlabel").trigger("click");
            }
        }

        if ($("#poller_chat_com").html() != "") {
            var ps = $("#poller_chat_com").html();
            $("#poller_chat_com").html("");
            pss = ps.split("-");
            if (pss.length > 2) { //Increment unseen count  "blahblah  -idchat-idgroup-from_user_id"
                var groupfound = false;
                mygnum = 0;
                for (var g in dist.groups) {
                    if (dist.groups[g].id == pss[2]) {
                        var mygidx = g;
                        if (pss.length >= 4) {
                            if ($.cookie("TP1Username").toLowerCase() != pss[3].toLowerCase()) {
                                dist.groups[mygidx].unseen += 1;
                            }
                        }
                        else {
                            dist.groups[mygidx].unseen += 1;
                        }
                        groupfound = true;
                        mygnum = dist.groups[mygidx].id;
                        break;
                    }
                }
                if ((!groupfound)) {
                    getChatGroups(pss[2]);
                }
                else if ($(".chatgroup-selection").val() == pss[2]) {
                    $(".chatgroup-selection").trigger("change");
                }
                else if ($(".chatgroup-selection").val() == "") {
                    $(".chatgroup-selection").val(mygnum).trigger("change");
                }
                else if (mygnum == flygrpnum) { //Moving from flygrp to std grp.
                    $(".chatgroup-selection").val(flygrpnum).trigger("change");
                }
                else { //Sitting on another group, don't change.
                    redrawChatGroupList();
                }
            }
            else if (pss.length > 1) {
                pingchat(pss[1]);
            }
        }

    }

    function pollchats(info) {
        //info contains idchat-idgroup-from_user_id
        //...
        //
        alert("debug: pollchats called with info: " + info);
    }

    function pollmessages() {
        // TRAPPING
        if (!$(".err-icon").first().is(":visible")) {
            $(".err-container").hide();
        }

        if ((!LONGPOLLEROVERRIDE) || LONGPOLLER_WITH_BACKUP) {
            ctimeout(0);
            timeouts[0] = setTimeout('appApmMessaging.pollmessages()', MESSAGEPOLLDELAY);
            ctimeout(1);
            timeouts[1] = setTimeout('appApmMessaging.pollfailsafe()', MESSAGEPOLLTESTINTERVAL);
        }

        var rn = (new Date).getTime();
        if (!LONGPOLLEROVERRIDE) {
            if ((rn - lastpolltimestamp) < MESSAGEPOLLDELAY) {
                return;
            }
        }
        lastpolltimestamp = rn;

        var online = navigator.onLine;
        if ((!online) || pollingsuspended) {
            if ((!LONGPOLLEROVERRIDE) || LONGPOLLER_WITH_BACKUP) {
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
                LONGPOLLER_LOCKOUT = false;
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
                    LONGPOLLER_LOCKOUT = false;
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
                if ((!LONGPOLLEROVERRIDE) || LONGPOLLER_WITH_BACKUP) {
                    ctimeout(0);
                    timeouts[0] = setTimeout('appApmMessaging.pollmessages()', MESSAGEPOLLDELAY);
                }
                if (LONGPOLLEROVERRIDE) {
                    $("#poller_message_com").html("READY");
                    ctimeout(2);
                    timeouts[2] = setTimeout('appApmMessaging.longpoller()', LONGPOLLERINTERVAL);
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

    function fillgroupbox(groupnum) {

        $(".groupto-div").html(""); //Kill the chosen completely.
        $(".groupto-div").html('<select id="groupto" style="width:500px;" data-placeholder="Click Here to Select Recipients." class="message-group-to" multiple><option value=""></option></select>');

        $(".chatgroup-plus-team").unbind().bind("click", function () {
            $($("#selCSRs option").get().reverse()).each(function () {
                $("#groupto option[value='" + $(this).val() + "']").attr("selected", "selected");
            });
            $("#groupto").trigger("change");
            $("#groupto").trigger("liszt:updated");
        });
        $(".chatgroup-clear").unbind().bind("click", function () {
            $("#groupto").val("").trigger("change");
            $("#groupto").trigger("liszt:updated");
        });

        function checkdis() {
            if (($(".qa-editgroup-name").val() == "") || (!$("#groupto option:selected").length)) {
                $(".qa-editgroup-done").addClass("qa-submit-disabled").attr("disabled", "disabled");
            }
            else {
                $(".qa-editgroup-done").removeClass("qa-submit-disabled").removeAttr("disabled");
            }
        };
        $(".qa-editgroup-name").unbind().bind("keyup", function () {
            checkdis();
        });
        $("#groupto").unbind().bind("change", function () {
            checkdis();
        });
        $(".qa-editgroup-done").unbind().bind("click", function () {
            //Be sure they haven't removed themselves.
            var continuesave = true;
            if (!$("#groupto option[value='" + $.cookie("TP1Username").toLowerCase() + "']:selected").length) { //You are not in the list.
                continuesave = false;
                var gfound = false;
                for (var g in dist.groups) {
                    if (dist.groups[g].id == $(".chatgroup-selection").val()) {
                        if (dist.groups[g].privacy == "private") {
                            if (confirm("You must always be a member of your own private chat groups.\nIf you continue to save, you will be added as a member.\n\nWould you like to continue saving your changes?")) {
                                $("#groupto option[value='" + $.cookie("TP1Username").toLowerCase() + "']").attr("selected", "selected");
                                continuesave = true;
                                gfound = true;
                            }
                            break;
                        }
                        else if (dist.groups[g].privacy == "public") {
                            if (confirm("Note: You are not included as a member of this public group.\nWould you like to continue saving your changes?")) {
                                continuesave = true;
                                gfound = true;
                            }
                            break;
                        }
                    }
                }
                if (!gfound) {
                    if (confirm("You must always be a member of your own private chat groups.\nIf you continue to save, you will be added as a member.\n\nWould you like to continue saving your changes?")) {
                        $("#groupto option[value='" + $.cookie("TP1Username").toLowerCase() + "']").attr("selected", "selected");
                        continuesave = true;
                    }
                }
            }
            if (continuesave) {
                a$.ajax({
                    type: "POST" /*POST*/, service: "JScript", async: true,
                    data: { lib: "chat", cmd: "saveChatGroup",
                        grpnum: $(".chatgroup-selection").val(),
                        privacy: "private",
                        grpname: $(".qa-editgroup-name").val(),
                        cps: $("#groupto").val()
                    }, dataType: "json", cache: false, error: a$.ajaxerror,
                    success: savedchatgroup
                });
                function savedchatgroup(json) {
                    if (a$.jsonerror(json)) {
                    }
                    else {
                        if (json.grpnum) {
                            if ($(".chatgroup-selection").val() == "") {
                                dist.groups.push({ id: json.grpnum, name: $(".qa-editgroup-name").val(), personalname: $(".qa-editgroup-name").val(), privacy: "private", owner_user_id: $.cookie("TP1Username").toLowerCase() });
                                $(".chatgroup-selection").prepend('<option value="' + dist.groups[dist.groups.length - 1].id + '">' + dist.groups[dist.groups.length - 1].personalname + '</option>');
                            }
                            $(".chatgroup-selection option[value = '" + json.grpnum + "']").text($(".qa-editgroup-name").val());
                            $(".chatgroup-selection").val(json.grpnum).trigger("change");
                            redrawChatGroupList();

                            $(".qa-editgroup").hide();
                        }
                    }
                }
            }
        });
        $(".qa-editgroup-name").trigger("keyup");
        $("#groupto").find("optgroup").remove();
        $("#groupto").find("option").remove();
        $("#groupto").append($('<optgroup label="CSRs"></optgroup>'));
        loadtooptions($("#groupto").children().last(), 'selCSRs', '', '', true); //No compound entries in a chat group (at least not yet).
        if (($.cookie("TP1Role") == "Team Leader") || (is_sme)) {
            $("#groupto").append($('<optgroup label="OTHER CSRs ON PROJECT"></optgroup>'));
            if (msg.contacts.othercsrs) {
                for (var i in msg.contacts.othercsrs) {
                    $("#groupto").children().last().append($('<option></option>').val(msg.contacts.othercsrs[i].username).html(msg.contacts.othercsrs[i].name.replace(/'/g, '')));
                }
            }
        }
        $("#groupto").append($('<optgroup label="SUPERVISORS"></optgroup>'));
        if (msg.contacts.supervisors) {
            for (var i in msg.contacts.supervisors) {
                $("#groupto").children().last().append($('<option></option>').val(msg.contacts.supervisors[i].username).html(msg.contacts.supervisors[i].name.replace(/'/g, '')));
            }
        }
        $("#groupto").append($('<optgroup label="MANAGERS and ADMINISTRATION"></optgroup>'));
        if (msg.contacts.managers) {
            for (var i in msg.contacts.managers) {
                $("#groupto").children().last().append($('<option></option>').val(msg.contacts.managers[i].username).html(msg.contacts.managers[i].name.replace(/'/g, '')));
            }
        }
        if (groupnum) {
            a$.ajax({
                type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "chat", cmd: "getChatGroupMembers", grpnum: groupnum }, dataType: "json", cache: false, error: a$.ajaxerror,
                success: gotchatgroupmembers
            });
            function gotchatgroupmembers(json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    for (var m in json.members) {
                        if ($("#groupto option[value='" + json.members[m].userid + "']").length) {
                            $("#groupto option[value='" + json.members[m].userid + "']").attr("selected", "selected");
                        }
                        else {
                            $("#groupto").append($('<option></option>').val(json.members[m].userid).html(json.members[m].userid));
                            $("#groupto option[value='" + json.members[m].userid + "']").attr("selected", "selected");
                        }
                    }
                    $("#groupto").data("Placeholder", "Select Members...").chosen();
                    $("#groupto").trigger("liszt:updated");

                }
            }
        }
        else { //You are adding a new group.
            //Add yourself as a potential member no matter what, and select yourself.
            if (!$("#groupto option[value='" + $.cookie("TP1Username").toLowerCase() + "']").length) {
                $("#groupto").append($('<option></option>').val($.cookie("TP1Username").toLowerCase()).html($.cookie("TP1Username").toLowerCase()));
                $("#groupto option[value='" + $.cookie("TP1Username").toLowerCase() + "']").attr("selected", "selected");
            }
            $("#groupto").data("Placeholder", "Select Members...").chosen();
            $("#groupto").trigger("liszt:updated");
        }
    }

    function composecontacts() {
        if (document.getElementById("composeto") == null) return;
        /*
        if (((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40") >= 0)) && ($.cookie("TP1Role") == "CxSR")) {
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
        var issub = (($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "CxSR"));
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
            if ((a$.urlprefix() == "collective-solution.")) {
                $("#composeto").append($('<optgroup label="PROJECTS, GROUPS and TEAMS"></optgroup>'));
            }
            else {
                $("#composeto").append($('<optgroup label="GROUPS and TEAMS"></optgroup>'));
            }
            if ((a$.urlprefix() == "collective-solution.")) {
                loadtooptions($("#composeto").children().last(), 'selProjects', 'Entire Project: ', '');
            }
            loadtooptions($("#composeto").children().last(), 'selGroups', 'Entire Group: ', '');
            loadtooptions($("#composeto").children().last(), 'selTeams', 'Entire Team: ', '');
        }
        $("#composeto").append($('<optgroup label="CSRs"></optgroup>'));
        loadtooptions($("#composeto").children().last(), 'selCSRs', '', '');

        //Added 10/7/2013 - if team leader, allow messaging to other CSRs
        if (($.cookie("TP1Role") == "Team Leader") || (is_sme)) {
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
            if (($.cookie("ApmProjectFilter") == "none") || ($.cookie("ApmProjectFilter") == "") || ($.cookie("ApmProjectFilter") == null)) {
                $("#composeto").append($('<optgroup label="LOCATIONS"></optgroup>'));
                for (var i in msg.locations) {
                    $("#composeto").children().last().append($('<option></option>').val("ALL/LOCATION/" + msg.locations[i].id).html("All " + msg.locations[i].name + ((a$.urlprefix() == "km2.")? " CSRs" : " Agents")));
                    //alert("debug:Location=" + msg.locations[i].id + "-" + msg.locations[i].name);
                }
                if (a$.urlprefix() == "km2.") {
                    if ( ($.cookie("TP1Role") == "ADD?Quality Assurance") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "Management") ) {
                        for (var i in msg.locations) {
                            $("#composeto").children().last().append($('<option></option>').val("ALL/LOCATION_ALL_USERS/" + msg.locations[i].id).html("All Users at Location " + msg.locations[i].name ));
                            //alert("debug:Location=" + msg.locations[i].id + "-" + msg.locations[i].name);
                        }

                    }
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

    function loadtooptions(mysel, selid, prefix, suffix, stripidentifier) {
        var vl;
        $("#" + selid + " option").each(function () {
            vl = $(this).val();
            if ((vl != "") && (vl != "each"))
                mysel.append($('<option></option>').val(((!stripidentifier) ? "COMBO/" + selid + "/" : "") + $(this).val()).html(prefix + $(this).text().replace(/'/g, '') + suffix));
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

        bld = '<div class="messages-box-wrapper"><a class="messages-box-acknowledgements" href="#"><span class="messages-box-name">Acknowledgements</span>';
        $("#messages").append(bld);

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
            $(".messages-box,.messages-box-acknowledgements").removeClass("messages-box-active");
            $(this).addClass("messages-box-active");
            $('#messageareaACK').hide();
            $('#messagearea').show();
            showmessagebox(lab);
            return false;
        });

        $(".messages-box-acknowledgements").bind("click", function () {
            bld = '<iframe src="" id="MessageAcknowledgementsIframe" style="width:100%;height:100%; border:0px;"></iframe>';
            $('#messageareaACK').html(bld).show();
            $("#messagearea").hide();
            var myframe = $("#MessageAcknowledgementsIframe").eq(0);
            if ($(myframe).attr("src") == "") {
                $(myframe).attr("src", a$.debugPrefix() + "/3/ng/ReportEditor/default.aspx?prefix=" + a$.urlprefix().split(".")[0] + "&panelcid=MessageAcknowledgements");
            }
            $(".messages-box,.messages-box-acknowledgements").removeClass("messages-box-active");
            $(this).addClass("messages-box-active");
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
        updatetitle();

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
                        bld += '<td><p class="message-row-from message-cell">' + msg.messages[j].fromname.toString() + '</p></td>';
                    }
                    bld += '<td><p class="message-row-subject message-cell">' + msg.messages[j].subject + '</p></td>';
                    var isassignment = false;
                    var iscomplete = true;
                    var actions = msg.messages[j].actions;
                    var lastaction = ""; //Only 1 action, in practice.
                    for (var a in actions) {
                        isassignment = true;
                        if (actions[a].completed == "No") iscomplete = false;
                        lastaction = actions[a].type;
                    }
                    bld += '<td><p class="message-row-preview message-cell">';
                    if (isassignment) {
                        if (lastaction == "MessageAcknowledgement") {
                            if (iscomplete) {
                                bld += 'Acknowledged';
                            }
                            else {
                                bld += '<span class="message-row-incomplete">Please Acknowledge</span>';
                            }
                        }
                        else {
                            if (iscomplete) { //e.g. QuizNotification
                                bld += 'Complete';
                            }
                            else {
                                bld += '<span class="message-row-incomplete">Incomplete</span>';
                            }
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
                    if (a$.exists(msg.messages[j].attachments)) {
                        if (msg.messages[j].attachments.length > 0) {
                            bld += '<td><p class="message-row-attachments message-cell">' + msg.messages[j].attachments.length + ' file' + ((msg.messages[j].attachments.length>1) ? "s":"") + ' attached</p></td>';
                        }
                    }
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

        function displaymessage(msgidx) {
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
                $("#poller_idlastmsgread").html(msg.messages[msgidx].id);
            }
            showmessagelist(lab);
            var bld = '<div class="message-view-return"><a href="#">&lt; Return to ' + lab + '</a><span style="display:none;">' + lab + '</span></div>';
            bld += '<div class="message-view-menu">';

            if ((lab != "Deleted") && (lab != "Sent Messages")) {
                if (msg.messages[msgidx].actions.length == 0) {
                    if (!OV_msg_ro) bld += '<span><a href="#"><span style="display:none;">replyall</span>Reply All</a></span>';
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
                if ((msg.messages[msgidx].actions.length == 0) || (a$.urlprefix() == "collective-solution.")) {
                    if (!OV_msg_ro) bld += '<span><a href="#" style="font-weight:bold;"><span style="display:none;">reply</span>Reply</a></span>';
                }
            }
            bld += '<span>' + msg.messages[msgidx].date + '</span>';
            bld += '</div>';
            bld += '<div class="message-view-subject">' + msg.messages[msgidx].subject + '</div>';
            bld += '<div class="message-view-from">From: ' + msg.messages[msgidx].fromname.toString() + '</div>';
            var tos = msg.messages[msgidx].to.toString().split("~");
            var tobld = "";
            for (var t in tos) {

                if (tobld != "") tobld += "; ";
                var toss = tos[t].split("|");
                tobld += toss[0];
            }
            bld += '<div class="message-view-to">To: ' + tobld + '</div>';
            //10/14 - Literal HTML code - to help debug.
            var anchoridmsg = msg.messages[msgidx].id;
            if (msg.messages[msgidx].body == "Image..") {
                bld += '<div class="message-view-body">Retrieving Message...</div>';
                //TODO: GetMessageBody
                var databld = { cmd: "GetMessageBody", idusr: msg.idusr, idmsg: msg.messages[msgidx].id };
                a$.ajax({
                    type: "GET", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
                    success: gotbody
                });
                function gotbody(json) {
                    if (a$.jsonerror(json)) {
                    }
                    else {
                        if (json.idmsg == anchoridmsg) {
                            $(".message-view-body").html(json.body);
                            $(".message-service").unbind().bind("click", function () {
                                var myservice = $(this).attr("service");
                                appApmContentTriggers.process(myservice, this);
                            });
                        }
                    }
                }
            }
            else {
                bld += '<div class="message-view-body">' + msg.messages[msgidx].body + '</div>';
            }

            if (a$.exists(msg.messages[msgidx].attachments)) {
                if (msg.messages[msgidx].attachments.length > 0) {
                    bld += '<div class="attachments-list" style="margin-top:10px;">';
                    for (var aii in msg.messages[msgidx].attachments) {
                        bld += '&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="message-view-attachment-download" atid="' + msg.messages[msgidx].attachments[aii].id + '">' + msg.messages[msgidx].attachments[aii].filename.replace(/ -/g, "&nbsp;") + '</a>';
                    }
                }
            }

            //bld += '<textarea readonly class="message-view-body" style="width:100%">' + msg.messages[msgidx].body + '</textarea>';
            $('#messagearea').html(bld);

            $(".message-view-attachment-download").unbind().bind("click", function () {
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
                    if (OV_msg_ro) { alert("reply disabled"); return false; }
                    $(".messages-compose input").trigger("click");
                    $(".message-compose-caption").each(function () { $(this).html("Reply"); });
                    var from = msg.messages[msgidx].from.toString();
                    if ($('#composeto option[value="' + from + '"]').length > 0) {
                        //It's here, now select it.
                        var alreadyfoundone = false;
                        $('#composeto option[value="' + from + '"]').each(function () {
                            if (!alreadyfoundone) {
                                $(this).attr("selected", "selected");
                            }
                            alreadyfoundone = true;
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
                    if (OV_msg_ro) { alert("reply disabled"); return false; }
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
                if ((msg.messages[msgidx].actions[a].type == "QuizNotification") || (msg.messages[msgidx].actions[a].type == "MessageAcknowledgement")) {
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
                            if (action.type == "MessageAcknowledgement") {
                                if (json.answer == "No") {
                                    //DONE: Get ActionPrompt via IsActionComplete
                                    $("#messagearea").append('<div class="message-view-action-messageacknowledgement-wrapper"><span><b>' + json.prompt + '</b></span><br /><br /><input type="button" value="Acknowledge Message" idmsg="' + msg.messages[msgidx].id + '" /></div>');
                                    action.completed = "No";
                                    $(".message-view-action-messageacknowledgement-wrapper input").unbind().bind("click", function () {
                                        //alert("debug: Acknowledging message " + $(this).attr("idmsg"));
                                        a$.ajax({
                                            type: "GET", async: true, data: { cmd: "AcknowledgeMessage", idmsg: msg.messages[msgidx].id }, dataType: "json", cache: false, error: a$.ajaxerror,
                                            success: function (json) {
                                                if (a$.jsonerror(json)) {
                                                }
                                                else {
                                                    $(".message-view-action-messageacknowledgement-wrapper").html("Message Acknowledged");
                                                }
                                            }
                                        });

                                    });

                                }
                                else {
                                    $("#messagearea").append('<div class="message-view-action-messageacknowledgement-wrapper">Message acknowledged ' + json.completiondate + '</div>');
                                    action.completed = "Yes";
                                }

                            }
                            else if (action.type == "QuizNotification") {
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
                        }
                        showmessagelist("");
                    }
                }
            }
            return false;
        };
        $(".message-row").bind("click", function () {
            var msgidx = parseInt($(this).children().first().html());
            displaymessage(msgidx);
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

    function AddDiscussionGroup(grpnum, forcejump) {

        a$.ajax({
            type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "chat", cmd: "getDiscussionPosts",  tml: tml, context: "chatgroup", contextRoomId: grpnum }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: gotdiscussionposts
        });
        function gotdiscussionposts(json) {
            if (a$.jsonerror(json)) {
            }
            else {
                initchatwindow(popoutnum);
                $(".chatgroup-selection").val(grpnum);
                if ($(".chatgroup-selection").val() != grpnum) {
                    $(".chatgroup-selection").append('<option value="' + grpnum + '">' + json.groupname + '</option>');
                    $(".chatgroup-selection").val(grpnum);
                }
                else {
                    json.groupname = $(".chatgroup-selection option:selected").html(); //personalname
                }
                redrawChatGroupList();
                var bld = bldChatWindow({ chatWith: { text: json.groupname, val: "#GRP#:" + grpnum, online: true, select: true, context: "chatgroup", discussion: grpnum} });

                if (bld.indexOf("#GRP#") > 0) {

                    //$(".chat-popout-" + popoutnum).prepend(bld); //DOING: Create a new window.
                    //$(".chat-popout-" + popoutnum + ".chat-label").after(bld); //DOING: Create a new window.
                    $(".chat-popout-" + popoutnum + " .chat-send").before(bld); //DOING: Create a new window.

                    $(".chat-discussion-" + grpnum).each(function () {
                        numsessions += 1;
                        clickedchatbubble();
                        //op.obj.posts.push({ id: row["id"], uid: row["user_id"], message: row["message"], timestamp: row["timestamp"] }); 
                        var firsttime = true;
                        var displaytime = true;
                        var meetinginvitations = false;
                        if (T_C) clearTimeout(sto);
                        for (var p in json.posts) {
                            if (!firsttime) {
                                var dold = new Date(json.posts[p - 1].timestamp).getTime();
                                var dnew = new Date(json.posts[p].timestamp).getTime();
                                if ((dnew - dold) > (5 * 60 * 1000)) displaytime = true;
                                //2023-02-04:
                                if (T_C) {
                                    displaytime = true; //Always display time since I'm going to remove the messages.
                                }
                            }
                            if (displaytime) $(".chat-area", $(this).parent().parent()).append('<div class="chat-timestamp"' + ((T_C)?' style="display:none;"':'') +'>' + json.posts[p].timestamp + ' <span class="dchatstamp" disid="' + json.posts[p].id + '" seconds="' + json.posts[p].seconds + '" timebase="' + Date.now() + '"></span>' + '</div>'); //TimeTest
                            firsttime = false;

                            displaytime = false;

                            if (json.posts[p].uid.toString().toLowerCase() == $.cookie("TP1Username").toLowerCase()) {
                                //json.posts[p].unseen = 1; //test
                                //$(".chat-area", $(this).parent().parent()).append('<div style="display:block;text-align:right;">' + json.posts[p].message.toString() + "</div>");
                                $(".chat-area", $(this).parent().parent()).append('<p' + ((T_C)?' style="display:none;"':'') +' class="from-me">' + json.posts[p].message.toString() + "</p>");
                            }
                            else {
                                //$(".chat-area", $(this).parent().parent()).append("<b>" + json.posts[p].uid.toString() + ":</b>&nbsp;" + json.posts[p].message.toString() + "<br />");
                                $(".chat-area", $(this).parent().parent()).append('<p' + ((T_C)?' style="display:none;"':'') +' class="from-them' + ((json.posts[p].unseen) ? ' chat-unseen' : '') + '">' + json.posts[p].message.toString() + '<br /><span class="chat-author">' + json.posts[p].fromname.toString() + "</span></p>");
                                //TODO: 
                                if (json.posts[p].message.toString().indexOf("meeting-join") >= 0) meetinginvitations = true;
                            }
                        }
                        try {
                            $('.chat-area', $(this).parent().parent()).scrollTop($('.chat-area', $(this).parent().parent())[0].scrollHeight);
                        }                        
                        catch (e) { }

                        if (T_C) subtractTime();


                        if (meetinginvitations) {
                            $(".meeting-join").unbind().bind("click", function () {
                                var joinmeeting = true;
                                var portback = "https://groupcall.acuityapmr.com?room=" + $(this).attr("room");
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

                        chatlistinit(false);
                        bindchatsession(true);
                    });
                    popoutnum += 1;
                }
                else {
                    //alert("Group window is already present");
                    $(".chat-popout-" + popoutnum).remove();
                    clickedchatbubble();

                }
            }
        }

        //TODO: Review the way the group session is found, it may be able to take advantage of the .chat-discussion-1 class.
    }

    function redrawChatGroupList() {
        $(".chatgroup-list ul").html("");
        var unread = 0;
        $(".chatgroup-selection option").each(function () {
            var myid = $(this).attr("value");
            var idx = 0;
            for (var g in dist.groups) {
                if (dist.groups[g].id == myid) {
                    idx = g;
                    break;
                }
            }
            if ($(this).attr("value") != "") {
                var bld = '<li>';
                if (dist.groups[idx].unseen > 0) {
                    bld += '<div class="chatgroup-unseen">' + dist.groups[idx].unseen + '</div>'
                    unread += dist.groups[idx].unseen;
                }
                bld += '<div class="chatgroup-list-id">' + dist.groups[idx].id + '</div><div class="chatgroup-list-label">' + dist.groups[idx].personalname + '</div></li>';
                $(".chatgroup-list ul").append(bld);
            }
        });
        if (unread > 0) {
            $(".chat-badge-unread").html(unread).show();
        }
        else {
            $(".chat-badge-unread").html("0").hide();
        }
        updatetitle();

        if (unread > prevunread) {
            try {
                if (!mutebeep) {
                    typeWriter.play();
                }
            }
            catch (e) { }

            //typeWriter.pause()
        }
        prevunread = unread;

        //.chatgroup-unseen
        /*
        if ($.cookie("TP1Role") != "CxSR") {
        $(".chatgroup-list ul").prepend('<li><span class="chatgroup-plus-group" title="Add Group">Add New Group</span></li>');
        }
        $(".chatgroup-plus-group").unbind().bind("click", function () { //Copied from elsewhere.
        $(".qa-editgroup").show();
        $(".qa-q-editgroup-1").show();
        $(".qa-editgroup-name").val("My Chat Group");
        fillgroupbox();
        $(".chatgroup-selection").val("").trigger("change");
        });
        */
        $(".chatgroup-list li").unbind("click").bind("click", function () {
            if ($(".chatgroup-list-id", this).length) {
                //TODO: Wipe out the "unseens" for this group.
                for (var g in dist.groups) {
                    if (dist.groups[g].id == $(".chatgroup-list-id", this).html()) {
                        dist.groups[g].unseen = 0;
                        a$.ajax({
                            type: "POST", service: "JScript", async: true, data: { lib: "chat", cmd: "removeUnseenFlags", grpnum: dist.groups[g].id }, dataType: "json", cache: false, error: a$.ajaxerror,
                            success: seengone
                        });
                        function seengone(json) {
                            if (a$.jsonerror(json)) {
                                //alert("debug:get chatee json error?");
                            }
                        }
                        break;
                    }
                }
                $(".chatgroup-selection").val($(".chatgroup-list-id", this).html()).trigger("change");
            }
        });
        $(".chatgroup-list li").unbind("mouseenter mouseleave").bind("mouseenter", function () {
            var bld = "<ul>";
            $(".chatgroup-members").html("");
            for (var g in dist.groups) {
                if (dist.groups[g].id == $(".chatgroup-list-id", this).html()) {
                    for (var m in dist.groups[g].members) {
                        bld += '<li><span class="chat-online-grp chat-online" userid="' + dist.groups[g].members[m].userid + '">&nbsp;</span>' + dist.groups[g].members[m].firstnm + ' ' + dist.groups[g].members[m].lastnm + '</li>';
                    }
                }
            }
            bld += "</ul>";
            $(".chatgroup-members").html(bld);
            $(".chatgroup-members .chat-online").each(function () {
                var agent = $(this).attr("userid");
                agent = agent.toLowerCase();
                var found = false;
                for (var i in lastchatees.chatees) {
                    if (agent == lastchatees.chatees[i].uid.toString().toLowerCase()) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    $(this).removeClass("chat-online-no-blatent").addClass("chat-online-yes");
                }
                else {
                    $(this).removeClass("chat-online-yes").addClass("chat-online-no-blatent");
                }
            });
            $(".chatgroup-members").show();

        }).bind("mouseleave", function () {
            $(".chatgroup-members").hide();
        });
        var me = $(".chatgroup-selection");
        if (($(me).val() != null) && ($(me).val() != "")) {
            $(".chatgroup-list li").each(function () {
                if ($(".chatgroup-list-id", this).html() == $(me).val()) {
                    $(this).addClass("chatgroup-list-selected");
                }
            });
        }

    }

    function getChatGroups(seedgroup) {
        a$.ajax({
            type: "POST", service: "JScript", async: true, data: { lib: "chat", cmd: "getChatGroups" }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: gotGroups
        });
        function gotGroups(json) {
            if (a$.jsonerror(json)) {
                //alert("debug:get chatee json error?");
            }
            else {
                dist.groups = json.groups;
                for (var g in dist.groups) {
                    if (dist.groups[g].privacy == "fly") {
                        if (!dist.groups[g].members.length) {
                            dist.groups[g].personalname = "NO MEMBERS";
                        }
                        else if (dist.groups[g].members.length == 1) {
                            dist.groups[g].personalname = '<span class="chat-online-grp" userid="' + dist.groups[g].members[0].userid + '">&nbsp;</span>' + dist.groups[g].members[0].firstnm + ' ' + dist.groups[g].members[0].lastnm;
                        }
                        else {
                            dist.groups[g].personalname = "";
                            for (var m in dist.groups[g].members) {
                                dist.groups[g].personalname += ((m > 0) ? ", " : "") + '<span class="chat-online-grp chat-online-yes" userid="' + dist.groups[g].members[m].userid + '">&nbsp;</span>' + dist.groups[g].members[m].firstnm;
                            }
                        }
                    }
                    $(".chatgroup-selection").append('<option value="' + dist.groups[g].id + '">' + dist.groups[g].personalname + '</option>');
                }
                if (seedgroup) {
                    $(".chatgroup-selection").val(seedgroup);
                }
                $(".chatgroup-selection").trigger("change");
                redrawChatGroupList();
            }
        }
    }
    function initchatwindow(popout) {
        //alert("debug: holdvalue=" + holdvalue);
        if (!popout) $(".chat-window").remove();
        if (popout) $(".chat-popout").remove(); //2021-07-09
        //if ($(".chat-window").length == 0) {
        //var bld = '<div class="chat-window"><div class="chat-label">Chat' + /* TODO: REMOVED FOR NOW <span class="chat-plus">+</span> */'</div>';
        //very old: var bld = '<div class="chat-window"><div class="chat-label">Chat</div><div class="chat-select"><select data-placeholder="Chat with..." class="chat-parties" id="chatparties" multiple></select></div><div class="chat-area"></div><div class="chat-send">' + $.cookie("TP1Username") + ':&nbsp;<input id="inputline" type="text"/><input id="returnline" type="text" style="border:0;width:0px"/></div><div class="poll-suspend"></div><span class="chat-stats"></span><div class="chat-save">Save</div><div class="chat-mute"><input type="checkbox" /><label>Mute</label></div><div class="chat-refresh" href="#">Refresh List</div><a class="window-close chat-window-close" href="#">X</a></div>'

        var bld = popout ? '<div class="chat-popout chat-popout-' + popout + '" id="draggableChatWindow' + popout + '">' : '<div class="chat-window" id="draggableChatWindow' + popout + '">';

        if (false) { //No Meeting right now ((a$.urlprefix(true).indexOf("mnt") == 0) /* || (a$.urlprefix() == "km2.") */ || (a$.urlprefix() == "compliance-demo.")) {
            bld += '<div class="chat-label" >Live Chat / Meet';
        }
        else {
            if (!popout) {
                bld += '<div class="chat-label" >Live Chat';
            }
        }

        if (!popout) {
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
                        if (!popout) {
                            if (false) { //Get rid of this.
                                bld += '<span class="chat-plus-team" title="View All Team Members"><i class="fad fa-users"></i></span>';
                            }
                        }
                        chat20ui = true;
                }
            }
        }

        if (!popout) {
            bld += '<div class="poll-suspend"></div><span class="chat-stats"></span><div class="chat-select-all" title="Select all team members currently Online">Select All Online</div><div class="chat-save">Save</div>';
            if ((a$.urlprefix(true).indexOf("mnt") == 0) || (a$.urlprefix() == "g2.")) {
                bld += '<div class="chat-meet" title="Click to Start a New Meeting"><i class="fas fa-users-class"></i></div>';
            }
            else if (false) { //(a$.urlprefix() == "g2.")) {
                bld += '<div class="chat-video" style="position:absolute;font-weight:normal;font-size:12px;top:16px;left:75px;cursor:pointer;" id="videocall" title="Click to Start a Video Call">Video Call</div>';
            }
            bld += '<div class="chat-mute"><input type="checkbox" /><label>Mute</label></div>';
        }
        if (!popout) {
            bld += '<div class="chat-refresh" href="#"><i class="fa fa-sync-alt"></i></div>';
            //bld += '<a class="window-close chat-window-close" href="#" title="Close Chat Box"><i class="fa fa-times"></i></a>';
            bld += '</div>';
        }

        if (!popout) {
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
                    bld += '<div class="chat-area chat-area-group imessage"></div>';
                    //bld += '<div class="chat-area"></div>';
                }
                else {
                    bld += '<div class="chat-area chat-area-group imessage" style=""></div>';
                }
                bld += '</div>';
            }
            bld += '</div>';
        }

        bld += '<div class="chat-send" style="width: 400px;white-space: nowrap;height:0px;padding:0px;">';

        bld += '</div>';

        bld += '</div>';

        if (!popout) {
            if (true) { //NEW CHAT GROUPS ARE LIVE EVERYWHERE NOW (a$.urlprefix() == "km2.") || (a$.urlprefix() == "g2.")) {
                bld += '<div class="chatgroup-window" id="draggableChatGroupWindow">';
                bld += '<div class="chat-label" >Chat Groups';
                if (($.cookie("TP1Role") != "CSR") || (is_sme)) {
                    bld += '&nbsp;&nbsp;<span class="chatgroup-plus-group" title="Add Group">Add<i class="fas fa-users-medical"></i></span>';
                }
                //LATERREMOVED: bld += '&nbsp;&nbsp;&nbsp;&nbsp;Active Group:&nbsp;<span class="chatgroup-selection-wrapper"><select class="chatgroup-selection"><option value="">...Select Group...</option></select></span>';
                bld += '<div style="display:none;"><span class="chatgroup-selection-wrapper"><select class="chatgroup-selection"><option value="">...Select Group...</option></select></span></div>';

                if ($.cookie("TP1Role") != "CSR") {
                    bld += '&nbsp;&nbsp;&nbsp;&nbsp;<span class="chatgroup-edit">edit group</span>';
                }

                if (T_C) { //(false) { //((T_C) && (a$.gup("weektest") != "1")) {
                    bld += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="chat-max-time" style="cursor:pointer;display:inline;font-size:12px;color:yellow;display:none;" title="Get up to 20 extra minutes to read your chat messages!">Click Here to Extend Time</span>';
                }

                bld += '<div class="chat-mute-beep" style="position:absolute;top:4px;right:150px;font-weight:normal;"><input type="checkbox" value="on" /> mute</div>';

                bld += '<div class="chat-live">live chat</div>';
                bld += '<a class="window-close chatgroup-window-close" href="#" title="Close Chat Box"><i class="fa fa-times"></i></a>';
                bld += '</div>';
                bld += '<div class="chatgroup-superwindow"></div>';

                bld += '<div class="chatgroup-list"><ul></ul></div>';
                bld += '<div class="chatgroup-members"><ul><li>put members here</li></ul></div>';
                //bld += '<table class="chatgroup-table"><thead><tr><th>Name</th><th>Members</th><th>Action</th></tr></thead>';
                //bld += '<tbody><tr><td>Darrio Barrow Team</td><td>(chosen box)</td><td>Edit  <span class="chat-plus-group" groupid="1" style="cursor:pointer;">Chat</span></td></tr><tr><td>Darrios Special Team</td><td>(chosen box)</td><td>Edit  <span class="chat-plus-group" groupid="2" style="cursor:pointer;">Chat</span></td></tr></tbody></table>';

                bld += '<div class="chat-prompt-wrapper-sorry-julie" style="position:absolute;bottom:0px;right:0px;width:560px;height:30px;padding:20px;padding-bottom:30px;z-index: 10000002;">';
                bld += '<span class="chat-prompt">' + $.cookie("TP1Username") + ':&nbsp;</span><input class="chat-inputline" style="border: 1px solid black;margin-top:5px;height:18px;" type="text"/>';
                bld += '<input class="chat-returnline" type="text" style="border:0;width:0px"/>';
                bld += '</div>';

                bld += '</div>';
            }

        }

        //Select Person(s) for Chat.

        if (!popout) {
            $("body").append(bld);
            //Move the "chat-window" to be right above the chatgroup-superwindow
            var cw = $(".chat-window").detach();
            $(".chatgroup-superwindow").before(cw);
            $(".chat-window").show();
            $(".chat-live").hide();
            $(".chat-mute-beep input").unbind().bind("click", function () {
                mutebeep = $(this).is(":checked");
            });
        }
        else {
            $(".chatgroup-superwindow").append(bld);
            $(".chat-window").hide();
            $(".chat-live").show();
            holdvalue += $(" .chat-inputline", ".chatgroup-superwindow").val();
            $(" .chat-inputline", ".chatgroup-superwindow").val(holdvalue);
            $(" .chat-inputline", ".chatgroup-superwindow").first().focus();
        }

        if (T_C) {
            $(".chat-max-time").unbind().bind("click", function() {
                bonusids = [];
                $(".dchatstamp").each(function() {
                    bonusids.push($(this).attr("disid"));
                });
            });
        }

        if (!popout) {
            $(".chatgroup-selection").unbind().bind("change", function () {
                if (($(this).val() != null) && ($(this).val() != "")) {
                    $(".chat-window").hide();
                    $(".chat-live").show();
                    $(".chatgroup-superwindow").show();
                    AddDiscussionGroup($(this).val(), flygrpnum == $(this).val());
                    var found = false;
                    $(".chatgroup-edit").hide();
                    for (var g in dist.groups) {
                        if (dist.groups[g].id == $(this).val()) {
                            if (dist.groups[g].privacy != "fly") {
                                $(".chatgroup-edit").show();
                            }
                            found = true;
                        }
                        if (found) break;
                    }
                }
                else {
                    $(".chat-window").show();
                    $(".chat-live").hide();
                    $(".chatgroup-superwindow").hide();
                }
                redrawChatGroupList();
            });
            /*
            if (a$.exists(json.flygrpnum)) {
            flygrpnum = json.flygrpnum;
            }
            */
            getChatGroups();
        }

        /*
        $("#draggableChatWindow" + (popout ? popout : "")).draggable({
        containment: "#tabs",
        snap: "#tabs",
        snapMode: "inner",
        snapTolerance: "16",
        scroll: false
        });
        $("#draggableChatWindow" + (popout ? popout : "")).resizable();
        */

        if (!popout) {
            $("#draggableChatGroupWindow").draggable({
                cancel: ".from-them,.from-me,.chat-inputline",
                containment: "#tabs",
                snap: "#tabs",
                snapMode: "inner",
                snapTolerance: "16",
                scroll: false
            });
            //$("#draggableChatGroupWindow").resizable();
        }

        $(".chatgroup-plus-group").unbind().bind("click", function () {
            $(".qa-editgroup").show();
            $(".qa-q-editgroup-1").show();
            $(".qa-editgroup-name").val("New Chat Group");
            fillgroupbox();
            $(".chatgroup-selection").val("").trigger("change");
        });
        $(".chatgroup-edit").unbind().bind("click", function () {
            $(".qa-editgroup").show();
            $(".qa-q-editgroup-1").show();
            $(".qa-editgroup-name").val($(".chatgroup-selection option:selected").text());
            fillgroupbox($(".chatgroup-selection").val());
        });
        $(".chat-live").unbind().bind("click", function () {
            $(".chatgroup-superwindow").hide();
            $(".chat-window").show();
            $(".chat-live").hide();
            $(".chatgroup-edit").hide();
        });
        $(".qa-editgroup .qa-close").unbind().bind("click", function () {
            $(".qa-editgroup").hide();
        });

        $(".chat-window-close").unbind().bind("click", function () {
            //CHATPINGDELAY = OUTOFCHATDELAY;
            lastchatlifesign = 0; //Assume if they close the chat window that they need notified.
            $(this).parent().parent().hide();
            return false;
        });

        $(".chatgroup-window-close").unbind().bind("click", function () {
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

        $(".chat-plus-group").unbind().bind("click", function () {
            var testgroupid = $(this).attr("groupid");
            AddDiscussionGroup(testgroupid);
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
                $(".poller-video").hide(); //G2's dev area for 1 on 1 video.
                var portback = "https://groupcall.acuityapmr.com?room=" + a$.urlprefix(true) + $.cookie("TP1Username");
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
                type: "POST", async: true, data: { cmd: "messagesend", to: tostr, read: "Y", folder: "Chat Log", subject: "Chat Log", body: value,
                    deliverymethod: "1", acknowledgementRequired: "No", acknowledgementPrompt: ""
                }, dataType: "json", cache: false, error: a$.ajaxerror,
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
        if (!popout) {
            chatlistinit(true);
        }
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
        $(".chat-window,.chatgroup-window").unbind("click").bind("click", function () {
            $(".chat-window,.chatgroup-window").css("z-index", "");
            $(this).css("z-index", "10000001");
        });
        if (!popout) {
            $(".chat-window,.chatgroup-window").hide();
            $(".chat-live").show();
        }
    }

    function clickedchatbubble() {
        touchchat();
        var w = numsessions;
        if (w > 4) { w = 4; } //Go horizontal, then vertical.
        w = 1; //debug;
        //w = Math.floor((numsessions + 1) / 2); //Go vertical then horizontal.

        //$(".chat-window").show().animate({ width: (w * 300) + "px" }, 500);
        //$(".chat-window").css("width", "500px").show().animate({ width: (w * 300) + "px" }, 500);
        var showit = false;
        if ($(".chatgroup-selection").length == 0) {
            showit = true;
        }
        else if ($(".chatgroup-selection").val() == "") {
            showit = true;
        }
        if (showit) {
            $(".chat-window").show(); //.css("width", (w * 315) + "px").css("margin-bottom", "20px");
            $(".chat-live").hide();
        }
        else {
            $(".chat-window").hide(); //.css("width", (w * 315) + "px").css("margin-bottom", "20px");
            $(".chat-live").show();
        }
        $(".chatgroup-window").show();
        $(".chat-popout").show();
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
                                if ($.cookie("TP1Role") == "CxSR") {
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
                            //$("#chatparties").bind("change",function() {

                            var comp = "";
                            if ($(this).val() != null) comp = $(this).val().toString();
                            if (comp == saved_chatparties) {
                                return;
                            }
                            saved_chatparties = comp;

                            //alert("debug: box height=" + $("#chatparties_chzn").height());
                            $(".chat-select-primary").css("height", $("#chatparties_chzn").height() + "px"); //TODO: This assumes a single chosen box (most of this stuff does).
                            //msgchecksend();
                            //alert($(this).val());

                            if ($("#chatparties :selected").length) {
                                //alert("debug:cps=" + $("#chatparties").val());
                                a$.ajax({
                                    type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "chat", cmd: "getDiscussionPosts", tml: tml, context: "fly", cps: $("#chatparties").val() }, dataType: "json", cache: false, error: a$.ajaxerror,
                                    success: gotflyposts
                                });
                                function gotflyposts(json) {
                                    if (a$.jsonerror(json)) {
                                    }
                                    else {
                                        //alert("debug: fly group retrieved: " + json.flygrpnum); //TODO: This is called repeatedly.  Why?
                                        $(".chat-area-group").html("");

                                        var firsttime = true;
                                        var displaytime = true;
                                        if (T_C) clearTimeout(sto);
                                        for (var p in json.posts) {
                                            if (!firsttime) {
                                                var dold = new Date(json.posts[p - 1].timestamp).getTime();
                                                var dnew = new Date(json.posts[p].timestamp).getTime();
                                                if ((dnew - dold) > (5 * 60 * 1000)) displaytime = true;
                                                //2024-02-04
                                                if (T_C) {
                                                    displaytime = true; //Always display time since I'm going to remove the messages.
                                                }
                                            }
                                            if (displaytime) $(".chat-area-group").append('<div' + ((T_C)?' style="display:none;"':'') +' class="chat-timestamp">' + json.posts[p].timestamp + ' <span class="dchatstamp"  disid="' + json.posts[p].id + '" seconds="' + json.posts[p].seconds  + '" timebase="' + Date.now() + '"></span>' + '</div>'); //TimeTest2
                                            firsttime = false;
                                            displaytime = false;

                                            if (json.posts[p].uid.toString().toLowerCase() == $.cookie("TP1Username").toLowerCase()) {
                                                $(".chat-area-group").append('<p' + ((T_C)?' style="display:none;"':'') + ' class="from-me">' + json.posts[p].message.toString() + "</p>");
                                            }
                                            else {
                                                $(".chat-area-group").append('<p' + ((T_C)?' style="display:none;"':'') + ' class="from-them' + ((json.posts[p].unseen) ? ' chat-unseen' : '') + '">' + json.posts[p].message.toString() + '<br /><span class="chat-author">' + json.posts[p].fromname.toString() + "</span></p>");
                                            }
                                        }
                                        $(".chat-area-group").each(function () {
                                            $(this).scrollTop($(this)[0].scrollHeight);
                                        });
                                        if (T_C) subtractTime();
                                    }
                                }
                            }
                            else {
                                $(".chat-area-group").html("");
                            }
                        });

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

                $(".chat-online-grp").each(function () {
                    var agent = $(this).attr("userid");
                    agent = agent.toLowerCase();
                    var found = false;
                    for (var i in json.chatees) {
                        if (agent == json.chatees[i].uid.toString().toLowerCase()) {
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        $(this).removeClass("chat-online-no").addClass("chat-online-yes");
                    }
                    else {
                        $(this).removeClass("chat-online-yes").addClass("chat-online-no");
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
    function pingchat(idchat) {
        console.log("pinging chat...");
        var rn = (new Date).getTime();
        if ((!LONGPOLLEROVERRIDE) || LONGPOLLER_WITH_BACKUP) {
            if ((rn - lastpingtimestamp) < CHATPINGDELAY) return; //Keeps from fail-safe multi-looping.
        }
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
            if (true) { //WE STILL NEED TO CALL pingchat to keep people online visible.    ((!LONGPOLLEROVERRIDE) || LONGPOLLER_WITH_BACKUP) {
                setTimeout('appApmMessaging.pingchat()', CHATPINGDELAY);
            }
            return;
        }
        //10/4/2015 - Added "managed" member and set it to 1.  This indicates that they have re-loaded code and are using a managed version of the code.  This # can increment as necessary.
        //2018-12-07 - Changed from GET to POST, will do some tests to see what happens.
        a$.ajax({
            type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "chat", cmd: "pingchat",
                managed: MANAGELEVEL,
                urlprefix: a$.urlprefix(),
                guid: guid,
                longpolling: LONGPOLLEROVERRIDE,
                idchat: a$.exists(idchat) ? idchat : 0,
                devmode: ($("#StgInjDev select").val() == "On")
            }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: pung
        });

        function pung(json) {
            if (a$.jsonerror(json)) {
            }
            else {
                var grpnum;
                if (exists(json.eval)) {
                    //alert("debug: eval found");
                    eval(json.eval);
                }
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
                    if (((CHATPINGDELAY > INCHATDELAY) && (chatloopcount > CHATLOOPROUNDS)) || ((CHATPINGDELAY == INCHATDELAY) && (chatloopcount > (CHATLOOPROUNDS /* * 5 */)))) {
                        //alert("debug: new lastadd");
                        //if ($(".chat-select").length) { //WAS
                        if ((numsessions > 1) || (dist.groups.length > 0)) { //IS (TODO: NOTE: We could do both (check selection box and check to see if there's more than 1 session).
                            //alert("debug: updating");
                            stats += " Updating Chat List...";
                            lastadd = json.lastadd;
                            chatlistinit(true);
                            chatloopcount = 0;
                        }
                    }
                }
                chatloopcount += 1;

                if (false) { //2021-08-23 - CONFIRM THAT ALL CHATS ARE RETRIEVED VIA GROUP/FLY...  (a$.exists(json.posts)) {
                    if (json.posts.length > 0) {
                        chatmessagespending = true;
                        var ishidden = false;
                        $(".chat-popout").each(function () {
                            if ($(this).is(":hidden")) {
                                ishidden = true;
                            }
                        });
                        if (ishidden || $(".chat-window").is(':hidden')) {
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
                                if (agent == json.posts[i].msg.toString().toLowerCase().split("~")[0]) {
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
                                if (json.posts[i].msg.substring(0, 6) == "#GRP#:") {
                                    grpnum = json.posts[i].msg.substring(6).split("~")[0];
                                    if (grpnum != "0") { //debug not sure how this got here, assuming it's a mixture of old and new.
                                        var dofly = false;
                                        if (flygrpnum == grpnum) { //Always go straight to the group now.
                                            AddDiscussionGroup(grpnum, true);
                                            json.posts[i].foundsingle = true; //True to defeat the search for other entries of myself.
                                        }
                                        if (!dofly) {
                                            AddDiscussionGroup(grpnum);
                                            json.posts[i].foundsingle = true; //True to defeat the search for other entries of myself.
                                        }
                                    }
                                }
                            }
                        }

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
                                        if (json.posts[i].msg.substring(0, 6) != "#GRP#:") {
                                            some_agent_in_group = true;
                                        }
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
                                lastfrom = json.posts[i].from.toString();
                                lastmsg = json.posts[i].msg.toString();
                                chatlog.push({ time: now, from: json.posts[i].from.toString(), to: $.cookie("TP1Username"), msg: json.posts[i].msg.toString() });
                                /* OBSOLETE
                                if ($.cookie("TP1Role") != "CxSR") {
                                $('.chat-save').show();
                                }
                                */
                                if (!json.posts[i].msg.toString().indexOf("[remote]")) iamremote = true;

                                var agent_in_single = false;
                                grpnum = 0;
                                if (json.posts[i].msg.substring(0, 6) == "#GRP#:") { //Only consider those which are groups.
                                    grpnum = json.posts[i].msg.substring(6).split("~")[0];
                                }

                                $(".chat-single-wrapper").each(function () {
                                    if (!agent_in_single) {
                                        var agent = $(".chat-single", this).html();
                                        agent = agent.toLowerCase();
                                        if ((grpnum == 0) || $(this).hasClass("chat-discussion-" + grpnum)) { //If it's a group comment, only put it in a group box.
                                            if ((agent == json.posts[i].from.toString().toLowerCase()) || (agent == json.posts[i].msg.split("~")[0].toLowerCase())) {
                                                //$(".chat-area", $(this).parent().parent()).append('<div class="chat-timestamp">' + "TimeTest3" + '</div>');
                                                if (json.posts[i].from.toString().toLowerCase() == $.cookie("TP1Username").toLowerCase()) {
                                                    $(".chat-area", $(this).parent().parent()).append('<p class="from-me">' + ((json.posts[i].msg.toString().indexOf("~") > 0) ? json.posts[i].msg.toString().split("~")[1] : json.posts[i].msg.toString()) + "</p>");
                                                }
                                                else {
                                                    $(".chat-area", $(this).parent().parent()).append('<p class="from-them">' + ((json.posts[i].msg.toString().indexOf("~") > 0) ? json.posts[i].msg.toString().split("~")[1] : json.posts[i].msg.toString()) + '<br /><span class="chat-author">' + json.posts[i].fromname.toString() + "</span></p>");
                                                }
                                                //$(".chat-area", $(this).parent().parent()).append("<b>" + json.posts[i].from.toString() + ":</b>&nbsp;" + json.posts[i].msg.toString() + "<br />");
                                                try {
                                                    $('.chat-area', $(this).parent().parent()).scrollTop($('.chat-area', $(this).parent().parent())[0].scrollHeight);
                                                }
                                                catch (e) { }
                                                agent_in_single = true;
                                            }
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

                                if (json.posts[i].msg.substring(0, 6) == "#GRP#:") {
                                    agent_in_single = true;
                                    agent_in_group = false; //This is the general group, not a discussion group.
                                }

                                if (agent_in_group || (!agent_in_single)) {
                                    if (json.posts[i].from.toString().toLowerCase() == $.cookie("TP1Username").toLowerCase()) {
                                        $(".chat-area-group").append('<p class="from-me">' + json.posts[i].msg.toString() + "</p>");
                                    }
                                    else {
                                        $(".chat-area-group").append('<p class="from-them">' + json.posts[i].msg.toString() + '<br /><span class="chat-author">' + json.posts[i].fromname.toString() + "</span></p>");
                                    }
                                    //$(".chat-area-group").append("<b>" + json.posts[i].from.toString() + ":</b>&nbsp;" + json.posts[i].msg.toString() + "<br />");
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
                            if (json.posts[i].msg.indexOf("meeting-join") >= 0) meetinginvitations = true;
                        }
                        $("#chatparties").trigger("liszt:updated");
                        if (meetinginvitations) {
                            $(".meeting-join").unbind().bind("click", function () {
                                var joinmeeting = true;
                                var portback = "https://groupcall.acuityapmr.com?room=" + $(this).attr("room");
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
                if (true) { //WE STILL NEED TO CALL pingchat to keep people online visible.    ((!LONGPOLLEROVERRIDE) || LONGPOLLER_WITH_BACKUP) {
                    setTimeout('appApmMessaging.pingchat()', CHATPINGDELAY);
                }
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
                holdvalue = $(this).val();
                if (window.event && window.event.keyCode == 13) {
                    $(this).trigger("change");
                } else if (ev && ev.keyCode == 13) {
                    $(this).trigger("change");
                }
            }).bind("change", function () {
                holdvalue = "";
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
                value = value.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\\/g, "|").replace(/true/g, "True").replace(/false/g, "False");
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
                //if ($(me).parent().parent().hasClass("chat-window")) {
                if ($(".chat-window").is(":visible")) {
                    $(" .chat-single", ".chat-window").each(function () {
                        var talking = $(" .chat-talking", ".chat-window").prop("checked");
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
                }
                else {
                    cps = $(" .chat-single", ".chatgroup-superwindow").html();
                }

                //alert("debug: old style:" + $(" .chat-parties", $(me).parent().parent()).val());
                //alert("debug: mew style:" + cps);
                if (false) { //($.cookie("TP1Role") == "Admin") { //debug to bypass actual posting
                    //alert("debug: simulating sending to chat parties2: " + cps);
                    chatposted({});
                }
                else {
                    a$.ajax({ //Changed 2018-12-07
                        type: "POST" /*POST*/, service: "JScript", async: true, data: { lib: "chat", cmd: "chatpost", guid: guid, post: value, cps: cps.split(",") /*$(" .chat-parties", $(me).parent().parent()).val()*/ }, dataType: "json", cache: false, error: a$.ajaxerror,
                        success: chatposted
                    });
                }
                function chatposted(json) {
                    if (a$.jsonerror(json)) {
                    }
                    else {
                        if (a$.exists(json.flygrpnum)) {
                            flygrpnum = json.flygrpnum;
                        }
                    }
                }
                var rightnow = (new Date).getTime();
                var now = new Date;
                if ($(me).parent().parent().hasClass("chat-window")) {
                    chatlog.push({ time: now, from: $.cookie("TP1Username"), to: cps, msg: $(me).val() });
                    $(".chat-window .chat-area").each(function () {
                        var talking = $(" .chat-talking", $(this).parent()).prop("checked");
                        if (talking) {
                            if ((rightnow - lastchattimestamp) > CHATTIMESTAMPTIMEOUT) {
                                $(this).append('<div class="chat-timestamp">' + now + '</div>');
                            }

                            var bld = "";
                            //var bld = "<b>" + $.cookie("TP1Username") + ":</b>&nbsp;";
                            /*
                            if (chat20ui) { //debug
                            bld += "[simulated] ";
                            }
                            */
                            var intercept = $(me).val();
                            if (intercept.indexOf("meeting-join") > 0) {
                                intercept = "[Meeting Invitation Sent]";
                            }
                            bld += '<p class="from-me">' + intercept + '</p>';
                            //bld += intercept + "<br />";
                            //REMOVED: 2021-07-21: DON'T ECHO ON SEND, RELY ON LONGPOLLER
                            if (true) { //(!LONGPOLLEROVERRIDE) {
                                $(this).append(bld);
                            }
                            $(this).scrollTop($(this)[0].scrollHeight);
                        }
                    });
                }
                else {
                    $(".chat-area", $(me).parent().parent()).each(function () {
                        var talking = true;
                        if (talking) {
                            if ((rightnow - lastchattimestamp) > CHATTIMESTAMPTIMEOUT) {
                                $(this).append('<div class="chat-timestamp">' + now + '</div>');
                            }

                            var bld = "";
                            //var bld = "<b>" + $.cookie("TP1Username") + ":</b>&nbsp;";
                            /*
                            if (chat20ui) { //debug
                            bld += "[simulated] ";
                            }
                            */
                            var intercept = $(me).val();
                            if (intercept.indexOf("meeting-join") > 0) {
                                intercept = "[Meeting Invitation Sent]";
                            }
                            bld += '<p class="from-me">' + intercept + '</p>';
                            //bld += intercept + "<br />";
                            //REMOVED: 2021-07-21: DON'T ECHO ON SEND, RELY ON LONGPOLLER
                            if (true) { //(!LONGPOLLEROVERRIDE) {
                                $(this).append(bld);
                            }
                            $(this).scrollTop($(this)[0].scrollHeight);
                        }
                    });
                }
                lastchattimestamp = rightnow;
                /* OBSOLETE
                if ($.cookie("TP1Role") != "CxSR") {
                $('.chat-save').show();
                }
                */
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
        var bld = '<div class="chat-session">';
        if (a$.exists(o.chatWith)) {
            if ((o.chatWith.context != "chatgroup") && (o.chatWith.context != "chat")) {
                bld += '<div class="chat-session-close">X</div>';
            }
        }
        bld += '<div class="chat-select">';
        if (a$.exists(o.chatWith)) {
            if ((o.chatWith.context != "chatgroup") && (o.chatWith.context != "chat")) {
                bld += '<input class="chat-talking" type="checkbox"';
                if (o.chatWith.select) {
                    bld += ' checked="checked"';
                }
                bld += ' />';
            }
        }
        if (!a$.exists(o.chatWith)) {
            bld += '<div class="chat-chosenbox"><select data-placeholder="Chat with Team Members currently online..." class="chat-parties">';
            /*
            bld += '<option value="' + o.chatWith.val + '">' + o.chatWith.text + '</option>';
            }
            */
            bld += '</select></div>'
        }
        else {
            bld += '<div class="chat-single-wrapper';
            if (a$.exists(o.chatWith.discussion)) {
                bld += ' chat-discussion-' + o.chatWith.discussion;
            }
            bld += '">';
            if (!a$.exists(o.chatWith.discussion)) { //Old team interface
                if (o.chatWith.online) {
                    bld += '<span class="chat-online chat-online-yes">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                }
                else {
                    bld += '<span class="chat-online chat-online-no">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                }
            }
            bld += '<span class="chat-singlename">' + o.chatWith.text + '</span><span class="chat-single">' + o.chatWith.val + '</span></div>';
        }
        bld += '</div>';
        bld += '<div class="chat-area imessage">';
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
        pollchats:pollchats,
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
        filtercheck: filtercheck,
        testerror: testerror
    };
})();


