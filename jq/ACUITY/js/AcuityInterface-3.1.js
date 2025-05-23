(function () {
    //set innerhtml of span header_userID_lvl to the current username (from a cookie)
    var un = $.cookie("ERSUsername");
    //alert("debug: Receiving cookie = " + un);
    //un = "DEBUGGING"; //TODO:DUCKDEBUG: Security Defeat (Remove)
    if (un) { }
    else {
        //alert("Please Log In");
        window.location = "http://" + appLib.urlprefix() + "acuityapm.com/login.aspx";
        return;
    }
    //alert("debug: hello 1");
    //Added 12/11/2014 to more assertively keep restricted logins off of various pages.
    var rs = $.cookie("ApmProjectFilter");
    if (false) { //(rs != "") {
        var mycid = appLib.gup("cid")
        var sPath = appLib.xss(window.location.pathname);
        var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
        switch (sPage.toLowerCase()) {
            case "reporttable.aspx":
                var qs = window.location.search;
                window.location = "TP1ReportTable.aspx" + qs;
                break;
            case "qualitydashboard.aspx":
                window.location = "TP1ReportsMenu.aspx?cid=QualityClient&sb=qe";
                break;
            case "tp1reportsmenu.aspx":
                if ((appLib.urlprefix() == "ces.") || (appLib.urlprefix() == "ces-demo.")) {
                    switch (mycid.toLowerCase()) {
                        case "":
                            mycid = "QualityClient";
                            break;
                        case "quality":
                            mycid = "QualityClient";
                            break;
                        case "kpi":
                        case "kpiclient":
                            mycid = "QualityClient";
                            break;
                        case "quiz":
                            mycid = "QuizClient";
                            break;
                        default:
                            break;
                    }
                    if (mycid != appLib.gup("cid")) {
                        window.location = "TP1ReportsMenu.aspx?cid=" + mycid + "&sb=" + appLib.gup("sb");
                    }
                }
            case "tp1reporttable.aspx":
                if ((appLib.urlprefix() == "ces.") || (appLib.urlprefix() == "ces-demo.")) {
                    if ((mycid.toLowerCase().indexOf("project") >= 0) || (mycid.toLowerCase().indexOf("location") >= 0)) {
                        window.location = "TP1ReportsMenu.aspx?cid=QualityClient&sb=" + appLib.gup("sb");
                    }
                }
                break;
            default:
                break;
        }
    }

    document.getElementById("header_userID_lbl").innerHTML = $.cookie("ERSUsername");
    //set the current sidebar based on gup("li") index ( - 1 ) to id of 'sidebar_liActiveHeader'
    //trim the width of the reportarea div by 152 pixels
    sizebars();

    function setsidebarbyid(id) {
        //Keep the app from setting the sidebar highlight if there is an "sb" parameter
        if (appLib.gup("sb") != "") {
            if (appLib.gup("sb") != id) return;
        }
        var d = document.getElementById("sidebar_ulLevel1");
        var sbid = id;
        if (d) {
            var li = d.firstChild;
            while (li) {
                if (li.id == ("sb_" + sbid)) {
                    var a = li.firstChild;
                    a.id = "sidebar_liActiveHeader";
                    break;
                }
                li = li.nextSibling;
            }
        }
    }

    //Allow an "sb" parameter to override any explicit sidebar setting
    if (appLib.gup("sb") != "") {
        setsidebarbyid(appLib.gup("sb"));
    }

    function sizebars() {
        try {
            $("#reportarea").width(($(window).width() - 152) + "px");
            $("#reportarea").height(($(document).height() - 96) + "px");
            $("#sidebar").height(($(document).height() - 96) + "px");
        }
        catch (err) { }
    }

    function allowedroles(bld) {
        var rl = $.cookie("ERSRole");
        if (rl) {
            var roles = bld.split("/");
            var isokay = false;
            for (i = 0; i < roles.length; i++) {
                if ($.cookie("ERSRole") == roles[i]) {
                    isokay = true;
                    break;
                }
            }
            if (!isokay) {
                alert("Access to this page is not allowed for your current role: " + $.cookie("ERSRole"));
                window.location = "login.aspx";
            }
        }
    }
    var isauto = false;

    // global variables
    window.uiInterface = {
        setsidebarbyid: setsidebarbyid,
        allowedroles: allowedroles,
        isauto: isauto,
        sizebars: sizebars
    };
})();