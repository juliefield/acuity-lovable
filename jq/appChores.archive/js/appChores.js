/************
appChores - Allowance App
************/
(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;
    if (!$.jQTouch) { alert("This App requires jQTouch"); return; }

    var jQT = new $.jQTouch({
        //icon: 'needanicon.png',
        //icon4: 'needanicon4.png',
        addGlossToIcon: false,
        startupScreen: 'chores_startup.png',
        statusBar: 'gray',
        preloadImages: [
                    'jqtouch/themes/apple/img/activeButton.png',
                    'jqtouch/themes/apple/img/back_button.png',
                    'jqtouch/themes/apple/img/back_button_clicked.png',
                    'jqtouch/themes/apple/img/button.png',
                    'jqtouch/themes/apple/img/button_clicked.png',
                    'jqtouch/themes/apple/img/grayButton.png',
                    'jqtouch/themes/apple/img/greenButton.png',
                    'jqtouch/themes/apple/img/loading.gif'
                    ]
    });

    //The application object.
    var ao = {  //LOAD POINT ""
        "name": "Hannah Gackenheimer",
        "today": "2011/07/04",
        "ttdCnt": 3, //# in ttd that aren't "R"
        "completeCnt": 2, //# in complete that aren't "P"
        "pendingCnt": 0, //# in complete that ARE "P"
        "historyCnt": 1, //# in history
        "ttd": [  //LOAD POINT
            { "id": 1,
                "status": "N",
                "amount": 6.00,
                "title": "Laundry Bonus",
                "startdate": "2011/06/24",
                "duedate": "2011/07/03",
                "completedate": "2011/04/07",
                "desc": "This is a test description that says: Get the laundry current by mid-week (on either Wednesday or Thursday), and receive a $6 bonus.  This is in addition to the regular laundry completion which is due on Sunday."
            },
            { "id": 2,
                "status": "N",
                "amount": 12.00,
                "title": "Laundry",
                "startdate": "2011/06/26",
                "duedate": "2011/07/04",
                "completedate": "2011/04/07",
                "desc": "Have the laundry complete, including folding, by the end of day every Sunday."
            },
            { "id": 3,
                "status": "N",
                "amount": 2.00,
                "title": "Cat Box",
                "startdate": "2011/04/07",
                "duedate": "2011/07/05",
                "completedate": "2011/04/07",
                "desc": "Cat Box Cleaning (Yuck!)"
            }
        ],
        "complete": [ //LOAD POINT
            { "id": 4,
                "status": "C",
                "amount": 12.00,
                "amountpd" : 10.00,
                "title": "Laundry",
                "startdate": "2011/06/26",
                "duedate": "2011/06/27",
                "completedate": "2011/04/07",
                "desc": "Have the laundry complete, including folding, by the end of day every Sunday.",
                "notes": "done late - $2 penalty!"
            },
            { "id": 5,
                "status": "C",
                "amount": 12.00,
                "amountpd" : 12.00,
                "title": "Laundry2",
                "startdate": "2011/06/20",
                "duedate": "2011/06/20",
                "completedate": "2011/04/04",
                "desc": "Have the laundry complete, including folding, by the end of day every Sunday.",
                "notes": "great job!"
            }
        ],
        "history": [ //LOAD POINT
            { "id": 101,
                "date": "2011/05/21",
                "amount": 8.00,
                "itemCnt": 2,
                "items": [ //LOAD POINT
                    { "id": 105,
                      "amount": 2.00,
                      "amountpd" : 2.00,
                      "title": "Laundry2",
                      "startdate": "2011/06/20",
                      "duedate": "2011/06/20",
                      "completedate": "2011/04/04",
                      "desc": "Have the laundry complete, including folding, by the end of day every Sunday.",
                      "notes": "Good Job"
                    },
                    { "id": 106,
                      "amount": 8.00,
                      "amountpd": 6.00,
                      "title": "Laundry4",
                      "startdate": "2011/06/20",
                      "duedate": "2011/06/20",
                      "completedate": "2011/04/04",
                      "desc": "Have the laundry complete, including folding, by the end of day every Sunday.",
                      "notes": "Not done on time"
                    }
                ]
            }
        ]
    };

    function loadpoint(point) {
        //It's all loaded for now - load synchronously via ajax when ready.
    }

    function load(id) {
        for (var i in po) {
            if (po[i].id==id) {
                po[i].load();
                break;
            }
        }
    }

    function loadsync(id) {
        //For each anchor inside the div with id:
            //load it
    }

    var po = [
        {   id: "home",
            load: function () {
                loadpoint("");
                $("#workername").html(ao.name);
                if (ao.ttdCnt > 0) {
                    $("#todocount").html(ao.ttdCnt);
                    $("#todocount").addClass("counter");
                }
                if (ao.completeCnt > 0) {
                    $("#completecount").html(ao.completeCnt);
                    $("#completecount").addClass("counter");
                    $("#paybutton").html("Pay Me!");
                    $("#paybutton").addClass("greenButton");
                    $("#paybutton").css("display", "block");
                }
                else {
                    $("#paybutton").css("display", "none");
                }
                if (ao.pendingCnt) {
                    $("#historylbl").html("History (Payments Pending)");
                }
                else {
                    $("#historylbl").html("History");
                }
            }
        },
        {   id: "about",
            load: function () { }
        },
        {   id: "todo",
            load: function () {
                loadpoint("ttd");
                var i;
                var bld;
                var st;
                $("#todo ul").empty();
                for (i = 0; i < ao.ttd.length; i++) {
                    st = ao.ttd[i].status;
                    if ((st == "N") || (st == "W") || (st == "R")) {
                        bld = '<li class="arrow"><a href="#todoDesc" onclick="';
                        bld += 'appChores.setuptodoDesc(';
                        bld += "'" + ao.ttd[i].id + "'";
                        bld += ');';
                        bld += '">';
                        bld += ao.ttd[i].title + ' - $' + ao.ttd[i].amount;
                        if (ao.ttd[i].duedate < ao.today) {
                            bld += ' - <span style="color:red;">Past Due</span>';
                        }
                        else if (ao.ttd[i].duedate == ao.today) {
                            bld += ' - <span style="color:red;">Due Today</span>';
                        }
                        bld += '</a></li>';
                        $("#todo" + st).append(bld);
                    }
                }
                settodolistclass("N");
                settodolistclass("W");
                settodolistclass("R");
            }
        },
        {   id: "cmp",
            load: function () {
                loadpoint("complete");
                var i;
                var bld;
                var cnt = 0;
                var tot = 0.00;
                $("#cmpC").empty();
                for (i = 0; i < ao.complete.length; i++) {
                    if (ao.complete[i].status == "C") {
                        tot += ao.complete[i].amountpd;
                        bld = '<li class="arrow"><a href="#cmpDesc" onclick="appChores.setupcmpDesc(';
                        bld += "'complete','" + ao.complete[i].id + "'";
                        bld += ');">' + ao.complete[i].title + ' - $' + ao.complete[i].amountpd
                        if (    ao.complete[i].amountpd != ao.complete[i].amount) {
                            var adj = ao.complete[i].amountpd - ao.complete[i].amount;
                            bld += " ($" + adj + " Adjustment)"
                        }
                        bld += '</a></li>';
                        $("#cmpC").append(bld);
                    }
                }
                if ($("#cmpC").children().length > 0) {
                    $("#cmpC").removeClass("info");
                    $("#cmpC").addClass("rounded");
                    $("#cmptotal").html("Total Money Earned: $" + tot);
                }
                else {
                    $("#cmpC").append("<li><b>You don't have any chores marked as completed.</b>  When you're done with a chore, change it's status to 'Ready for Review', then ask Mom/Dad to review it.  Once they change the status to 'Completed', a button will appear so you can request to be paid.</li>");
                    $("#cmpC").removeClass("rounded");
                    $("#cmpC").addClass("info");
                    $("#cmptotal").html("");
                }
            }
        },
        {   id: "history",
            load: function () {
                loadpoint("complete");
                var i;
                var bld;
                var qcnt = 0;
                var qamount = 0.0;
                $("#history ul").empty();
                for (i = 0; i < ao.complete.length; i++) {
                    if (ao.complete[i].status == "Q") {
                        qcnt += 1;
                        qamount += ao.complete[i].amount;
                    }
                }
                if (qcnt) {
                    bld = '<li class="arrow"><a href="#historyQued" onclick="appChores.setuphistoryQued();">' + qcnt + ' chores pending pmt of $' + qamount + '</a></li>';
                    $("#historyul").append(bld);
                }
                else {
                    $("#historylbl").html("History");
                }
                if (ao.historyCnt) {
                    bld = '<li class="arrow"><a href="#historyPaid" onclick="appChores.setuphistoryPaid();">Payment History</a><small class="counter">' + ao.historyCnt + '</small></li>';
                    $("#historyul").append(bld);
                }
            }
        }
    ];

    /* //TODO:  Install this in place of local initialization
    $.getJSON("Chores.ashx", function (data) {
    ao = data;
    });
    */

    /* Pages:
        about
        home
        todo
        todoDesc
        cmp  (complete)
        cmpDesc
        history
        historyQued
        historyQuedDesc --Which is actually cmpDesc (maybe not if I do a new scheme).
        historyPaid
        historyPaidDesc (not yet made).

        each has its own div with markup
        each page has a load procedure
        each has a set of links which indicate necessary loading (loadsync, which is asynchronous)
        whenever something is modified:
            call post to write it back (async)
            loadsync myself

        to start:
            load home
            show home
            loadsync home
        when any link page is clicked:
            show page
            loadsync page
    */


    var currentid;
    $(document).ready(function () {
        load("home");
    });

    function payme() {
        var i;
        var cnt = 0;
        var tot = 0.0;
        for (i = 0; i < ao.complete.length; i++) {
            if (ao.complete[i].status == "C") {
                ao.complete[i].status = "Q";
                cnt += 1;
                tot += ao.complete[i].amount;
            }
        }
        alert("Request sent for payment for " + cnt + " chores, total amount = $" + tot);
        $("#paybutton").css("display", "none");
        $("#completecount").html("");
        $("#completecount").removeClass("counter");
        setcmp();
        sethistory();
    }



    function sethistory() {
        var i;
        var bld;
        var qcnt = 0;
        var qamount = 0.0;
        $("#history ul").empty();
        for (i = 0; i < ao.complete.length; i++) {
            if (ao.complete[i].status == "Q") {
                qcnt += 1;
                qamount += ao.complete[i].amount;
            }
        }
        if (qcnt) {
            bld = '<li class="arrow"><a href="#historyQued" onclick="appChores.setuphistoryQued();">' + qcnt + ' chores pending pmt of $' + qamount + '</a></li>';
            $("#historyul").append(bld);
        }
        else {
            $("#historylbl").html("History");
        }
        if (ao.history.length) {
            bld = '<li class="arrow"><a href="#historyPaid" onclick="appChores.setuphistoryPaid();">Payment History</a><small class="counter">' + ao.history.length + '</small></li>';
            $("#historyul").append(bld);
        }
    }

    function setuphistoryQued() {
        var i;
        var bld;
        var cnt = 0;
        var tot = 0.00;
        $("#historyQuedQ").empty();
        for (i = 0; i < ao.complete.length; i++) {
            if (ao.complete[i].status == "Q") {
                tot += ao.complete[i].amount;
                bld = '<li class="arrow"><a href="#cmpDesc" onclick="appChores.setupcmpDesc(';
                bld += "'history','" + ao.complete[i].id + "'";
                bld += ');">' + ao.complete[i].title + ' - $' + ao.complete[i].amount + '</a></li>';
                $("#historyQuedQ").append(bld);
                cnt += 1;
            }
        }
        if ($("#historyQuedQ").children().length > 0) {
            $("#historyQuedQ").removeClass("info");
            $("#historyQuedQ").addClass("rounded");
            $("#historyQuedtotal").html("Total Payment Amount: $" + tot);
        }
    }

    function setuptodoDesc(id) {
        var i;
        currentid = id;
        for (i = 0; i < ao.ttd.length; i++) {
            if (id == ao.ttd[i].id) {
                var dts = ao.ttd[i].duedate.split("/");
                $("#todoDesctitle").html(ao.ttd[i].title + " - Due: " + dts[1] + "/" + dts[2]);
                $("#todoDescdesc").html(ao.ttd[i].desc);
                $("#todoDescstatus").val(ao.ttd[i].status);
                break;
            }
        }
        return true;
    }

    function setupcmpDesc(tag,id) {
        var i;
        var aop=ao[tag];
        for (i = 0; i < aop.length; i++) {
            if (id == aop[i].id) {
                var dts = aop[i].completedate.split("/");
                $("#cmpDesctitle").html(aop[i].title + " - Completed: " + dts[1] + "/" + dts[2]);
                $("#cmpDescdesc").html(aop[i].desc);
                $("#cmpDescnotes").html(aop[i].notes);
                break;
            }
        }
        return true;
    }

    function changestatus() {
        var i;
        for (i = 0; i < ao.ttd.length; i++) {
            if (currentid == ao.ttd[i].id) {
                ao.ttd[i].status = $("#todoDescstatus").val();
                var cnt = settodo();
                if (cnt > 0) {
                    $("#todocount").html(cnt);
                    $("#todocount").addClass("counter");
                }
                else
                {
                    $("#todocount").html("");
                    $("#todocount").removeClass("counter");
                }

                break;
                //TODO: Post the changed status back to the server.
            }
        }
    }

    function settodolistclass(mychar) {
        var id = "#todo" + mychar; ;
        if ($(id).children().length > 0) {
            $(id).removeClass("info");
            $(id).addClass("rounded");
        }
        else {
            $(id).append("<li>None Found</li>");
            $(id).removeClass("rounded");
            $(id).addClass("info");
        }
    };

    // examples
    var EXAMPLEdefaultOptions = {
        chartxy: {
            renderTo: 'containersmother',
            anotherthing: 'to add',
            defaultSeriesType: 'column'
        }
    }

    function setuphistoryPaid() {
        var i;
        var bld;
        var cnt = 0;
        var tot = 0.00;
        $("#ulHistory").empty();
        for (i = 0; i < ao.history.length; i++) {
            tot += ao.history[i].amount;
            bld = '<li class="arrow"><a href="#historyPaidItems" onclick="appChores.setuphistoryPaidItems(';
            bld += "'" + ao.history[i].id + "'";
            bld += ');">PAID $' + ao.history[i].amount + ' on ' + ao.history[i].date + '</a></li>';
            $("#ulHistory").append(bld);
            cnt += 1;
        }
        if ($("#ulHistory").children().length > 0) {
            $("#ulHistory").removeClass("info");
            $("#ulHistory").addClass("rounded");
            $("#historyTotal").html("Total Money Paid: $" + tot);
        }
        return cnt;
    }

    // global variables
    window.appChores = {
        payme: payme,
        changestatus: changestatus,
        setuptodoDesc: setuptodoDesc,
        setupcmpDesc: setupcmpDesc,
        setuphistoryQued: setuphistoryQued,
        setuphistoryPaid: setuphistoryPaid,
    };
})();

