/************
appApmSignal - Com with the WSS app.
************/
/*

*/

(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    function init() {
        if (a$.urlprefix(true) == "mnt-nathan.") { //WSC DEBUG
            $(".wsc-debug").show();
        }
        if (true) { //WSC
            $("#wsc_message_com").html("READY");
        }

        longpoller();
        routepoller();
    }

    function testmultichoice() {
        a$.ajax({
            type: "POST", service: "JScript", async: true, data: { lib: "qa", cmd: "getTodaysQuizQuestion" }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: function (json) {
                if (json.questionfound) {
                    appEasycom.multiChoiceQuiz(json.libid);
                }
            }
        });
    }
    //setTimeout(testmultichoice, 10000); //Give it some time to get initialized.


    window.document.routelist = [];

    function longpoller() {
        var route = $("#wsc_route");
        switch (route.html()) {
            case "easyCom":
                appEasycom.init();
                route.html("");
                break;
            case "message":
                appApmMessaging.pollmessages();
                route.html("");
                break;
            case "quiz":
                appEasycom.multiChoiceQuiz($("#wsc_info").html());
                $("#wsc_info").html("");
                route.html("");
                break;
            case "":  //No route, what should it do?  Nothing?
                break;
            default: //All "locally unhandled" routes.
                window.document.routelist.push({ route: route.html(), info: $("#wsc_info").html(), datestamp: new Date() });
                route.html("");
                console.log(window.document.routelist);
                break;
        }
        if ($("#wsc_message_com").html() == "true") {
            alert("debug: Signal received.");
            //Do stuff here
        }
        setTimeout(function () {
            longpoller()
        }, 500); //500 MS
    }

    function routepoller() {
        var routelist = window.document.routelist;
        var current = new Date();
        for (var i in routelist) {
            var difference = Math.abs(current - routelist[i].datestamp);
            if (difference > 30000) {
                routelist.splice(i, 1);
            }
        }
        console.log(routelist);
        setTimeout(function () {
            routepoller()
        }, 30000);
    }


    // global variables
    window.appApmSignal = {
        init: init,
        longpoller: longpoller,
        routepoller: routepoller
    };
})();


