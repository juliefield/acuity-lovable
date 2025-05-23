(function () {
    //set innerhtml of span header_userID_lvl to the current username (from a cookie)
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;
    var un = $.cookie("TP1Username");
    //debugger;
    //alert("debug: Receiving cookie = " + un);
    //un = "DEBUGGING"; //TODO:DEBUG: Security Defeat (Remove)
    var filename = location.pathname.substr(location.pathname.lastIndexOf("/") + 1, location.pathname.length);
    //alert("debug:inframe " + filename + "called, inframe=" + a$.gup("inframe"));
    if (un) {
        //We are not anon
        //alert("debug: logged in");
        $("#header_userID_lbl").html($.cookie("TP1Username"));
        var stayanon = "";
        if (window["AllowAnonymous"]) {
            stayanon = "1";
        }
        //Take out this gorgeous interface in favor of a hack.
        //$("#logsomething").attr("href", "login.aspx?stayanon=" + stayanon + "&url=" + filename);
    }
    else {
        //alert("debug: not logged in");
        if (window["AllowAnonymous"]) {
            //alert("debug: anonymous allowed");
            $("#welcomelabel").html("");
            $("#logsomething").appendTo("#welcomelabel");
            $("#logsomething").attr("href", "login.aspx?inframe=" + a$.gup("inframe") + "&url=" + filename);
            $("#logsomething").attr("title", "Log In");
            $("#logsomething").html("Log In");
            $("#wanchbar").html("");
        }
        else {
            //alert("debug: anonymous not allowed");
            if (filename != "login.aspx") {
                //alert("Please Log In To Client Portal (Take this message out when it works)");
                var pars = "";
                if (a$.gup("prefix") != "") {
                    pars = "&inframe=" + a$.gup("inframe") + "&prefix=" + a$.gup("prefix");
                }
                window.location = "login.aspx?url=" + filename + pars;
            }
            return;
        }
    }
    var rs = $.cookie("ApmProjectFilter");
    if (rs != "") {
        var mycid = a$.gup("cid");
        var sPath = a$.xss(window.location.pathname);
        var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
        switch (sPage.toLowerCase()) {
            case "reporttable.aspx":
                var qs = window.location.search;
                window.location = "TP1ReportTable.aspx" + qs; //?
                break;
            case "qualitydashboard.aspx":
                if ((appLib.urlprefix() == "ces.") || (appLib.urlprefix() == "ces-demo.")) {
                    window.location = "TP1ReportsMenu.aspx?inframe=" + a$.gup("inframe") + "&cid=QualityClient&sb=qe";
                }
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
                        window.location = "TP1ReportsMenu.aspx?inframe=" + a$.gup("inframe") + "&cid=" + mycid + "&sb=" + appLib.gup("sb");
                    }
                }
                break;
            case "tp1reporttable.aspx":
                if ((appLib.urlprefix() == "ces.") || (appLib.urlprefix() == "ces-demo.")) {
                    if ((mycid.toLowerCase().indexOf("project") >= 0) || (mycid.toLowerCase().indexOf("location") >= 0)) {
                        window.location = "TP1ReportsMenu.aspx?inframe=" + a$.gup("inframe") + "&cid=QualityClient&sb=" + appLib.gup("sb");
                    }
                }
                break;
            default:
                break;
        }
    }

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
        var roles = bld.split("/");
        var isokay = false;
        for (i = 0; i < roles.length; i++) {
            if ($.cookie("TP1Role") == roles[i]) {
                isokay = true;
                break;
            }
        }
        if (!isokay) {
            alert("Access to this page is not allowed for your current role: " + $.cookie("TP1Role"));
            window.location = "login.aspx?inframe=" + a$.gup("inframe");
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