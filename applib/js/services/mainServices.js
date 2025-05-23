// SERVICES (also the special ng-legacy-container Directive below).

angularApp.service('legacy', function () {

    this.init = function ($scope, cidreload) {

        $scope.readyFilterSet = false;

        //alert("debug:inframe window.top.AcuityMainFrame=" + window.top.AcuityMainFrame);

        //If this is in an iframe, then bring down ALL cookied (for credentialing)
        //debugger;
        $scope.ARF = a$.WindowTop();
        if (window.location != $scope.ARF.location) {
            //Loop upwards to see 
            if ($scope.ARF != window.top) {
                //alert("debug:inframe - non-top main frame");
                //Redefine $.cookie
                $.cookie = function (setme, getme) {
                    if (!setme) {
                        return $scope.ARF.document.noncookies;
                    }
                    else if (!getme) {
                        return a$.exists($scope.ARF.document.noncookies[setme]) ? $scope.ARF.document.noncookies[setme] : "";
                    }
                    else {
                        $scope.ARF.document.noncookies[setme] = getme;
                    }
                }
            }
            else {
                var ck = window.top.document.cookie;
                var cks = ck.split("; ");
                for (var c in cks) {
                    ckss = cks[c].split("=");
                    $.cookie(ckss[0], ckss[1]);
                }
            }
        }

        //iframe Cookies need url escaped %'s removed.
        $.each(document.cookie.split(/; */), function () {
            var splitCookie = this.split('=');
            try {
                $.cookie(splitCookie[0], $.cookie(splitCookie[0]).replace(/\%20/g, " "));
            } catch (e) { }
        });

        //Cookies
        $scope.TP1Username = $.cookie("TP1Username");
        $scope.TP1Role = $.cookie("TP1Role");

        $scope.getKPIColorRGB = function (stdval) {
            var pc = a$.WindowTop().apmPerformanceColors;
            var obj = { color: "white", textColor: "black" };
            try {
                for (var ci in pc) {
                    if (stdval >= pc[ci].threshold) {
                        obj.color = pc[ci].color;
                        obj.textColor = a$.exists(pc[ci].textColor) ? pc[i].textColor : "#FEFEFE";
                        break;
                    }
                }
            } catch (e) { };
            return obj;
        }

        //PubSubs (used for Knockout communication, standardized to allow changes to be reflected in scope).
        $scope.filters = {};
        $scope.filters.cid = ""; //For easy comparison in case of cidreload.
        $scope.filters.Selected = {};

        var KILL_POLLING = false;

        var viewparams = "";
        if ($("#lblViewparams").length) {
            if ($("#lblViewparams").html() != "") {
                viewparams = $("#lblViewparams").html().replace(/&amp;/g, "&");
                $scope.filters.cid = $("#lblPanelcid").html(); //Not sure...
                //alert("debug: Viewparams found: " + viewparams);
                KILL_POLLING = true; //duck
                var vs = viewparams.split("&");
                for (var i in vs) {
                    var vss = vs[i].split("=");
                    if (vss.length > 1) {
                        $scope.filters[vss[0]] = valstr(vss[1]);
                        $.cookie(vss[0], $scope.filters[vss[0]]); //Unifyme
                    }
                }
                setTimeout(function () {
                    try { ko.postbox.publish("Filters", $scope.filters); } catch (e) { };
                    try { ko.postbox.publish("SearchClicked"); } catch (e) { };
                }, 1);
            }
        }

        function valstr(v) {
            if (Array.isArray(v)) {
                var vs = "";
                for (var i in v) {
                    if (vs != "") vs += ",";
                    vs += v[i];
                }
                return vs;
            }
            else {
                return v;
            }
        }


        var lastroutedate = 0;

        function checkfilters() {
            var filtersupdated = false;
            var plotted = false;
            if (KILL_POLLING) return;

            //NATHAN
            //SIGNALING
            try {
                for (var i in $scope.ARF.document.routelist) {
                    if ($scope.ARF.document.routelist[i].datestamp > lastroutedate) {
                        lastroutedate = $scope.ARF.document.routelist[i].datestamp;
                        ko.postbox.publish("Signal", $scope.ARF.document.routelist[i]);
                        break; //It's probably wise to not publish more than 1 without returning control (it'll be back around again in 1 second).
                    }
                }
            } catch (e) { };

            try {
                if ($("#Plotstamp", $scope.ARF.document).html() != $scope.filters.Plotstamp) {
                    $scope.filters.Plotstamp = $("#Plotstamp", $scope.ARF.document).html();
                    plotted = true;
                    $.cookie("Plotstamp", $scope.filters.Plotstamp); //Unifyme
                }
                if (valstr($("#selProjects", $scope.ARF.document).val()) != $scope.filters.Project) {
                    $scope.filters.Project = valstr($("#selProjects", $scope.ARF.document).val());
                    filtersupdated = true;
                    $.cookie("Project", $scope.filters.Project); //Unifyme
                }
                if (valstr($("#selLocations", $scope.ARF.document).val()) != $scope.filters.Location) {
                    $scope.filters.Location = valstr($("#selLocations", $scope.ARF.document).val());
                    filtersupdated = true;
                    $.cookie("Location", $scope.filters.Location); //Unifyme
                }
                if (valstr($("#selGroups", $scope.ARF.document).val()) != $scope.filters.Group) {
                    $scope.filters.Group = valstr($("#selGroups", $scope.ARF.document).val());
                    filtersupdated = true;
                    $.cookie("Group", $scope.filters.Group); //Unifyme
                }
                if (valstr($("#selTeams", $scope.ARF.document).val()) != $scope.filters.Team) {
                    $scope.filters.Team = valstr($("#selTeams", $scope.ARF.document).val());
                    filtersupdated = true;
                    $.cookie("Team", $scope.filters.Team); //Unifyme
                }
                if (valstr($("#selCSRs", $scope.ARF.document).val()) != $scope.filters.CSR) {
                    $scope.filters.CSR = valstr($("#selCSRs", $scope.ARF.document).val());
                    filtersupdated = true;
                    $.cookie("CSR", $scope.filters.CSR); //Unifyme
                }
                if (valstr($("#selKPIs", $scope.ARF.document).val()) != $scope.filters.KPI) {
                    $scope.filters.KPI = valstr($("#selKPIs", $scope.ARF.document).val());
                    filtersupdated = true;
                    $.cookie("KPI", $scope.filters.KPI); //Unifyme
                }
                if (valstr($("#selSubKPIs", $scope.ARF.document).val()) != $scope.filters.SubKPI) {
                    $scope.filters.SubKPI = valstr($("#selSubKPIs", $scope.ARF.document).val());
                    filtersupdated = true;
                    $.cookie("SubKPI", $scope.filters.SubKPI); //Unifyme
                }
                if (valstr($("#selQualityforms", $scope.ARF.document).val()) != $scope.filters.Qualityform) {
                    $scope.filters.Qualityform = valstr($("#selQualityforms", $scope.ARF.document).val());
                    filtersupdated = true;
                    $.cookie("Qualityform", $scope.filters.Qualityform); //Unifyme
                }
                if (valstr($("#StgScorecard select", $scope.ARF.document).val()) != $scope.filters.scorecard) {
                    $scope.filters.scorecard = valstr($("#StgScorecard select", $scope.ARF.document).val());
                    filtersupdated = true;
                }
                if (valstr($("#StgDashboard select", $scope.ARF.document).val()) != $scope.filters.dashboard) {
                    $scope.filters.dashboard = valstr($("#StgDashboard select", $scope.ARF.document).val());
                    filtersupdated = true;
                }
                if (valstr($("#StgInTraining select", $scope.ARF.document).val()) != $scope.filters.InTraining) {
                    $scope.filters.InTraining = valstr($("#StgInTraining select", $scope.ARF.document).val());
                    filtersupdated = true;
                }
                //if (($("#StgHireDatesFilter select").val() == "Filter On")
                if (valstr($("#StgHireDatesFilter select", $scope.ARF.document).val()) != $scope.filters.HireDatesFilter) {
                    $scope.filters.HireDatesFilter = valstr($("#StgHireDatesFilter select", $scope.ARF.document).val());
                    if ($scope.filters.HireDatesFilter != "Filter On") {
                        $scope.filters.HireDatesLabel = "";
                        $scope.filters.hiredate = "";
                    }
                    filtersupdated = true;
                }
                if ($scope.filters.HireDatesFilter == "Filter On") {
                    if (valstr($("#newhiredatesdl .hd-label", $scope.ARF.document).html()) != $scope.filters.HireDatesLabel) {
                        $scope.filters.HireDatesLabel = valstr($("#newhiredatesdl .hd-label", $scope.ARF.document).html());
                        if ($scope.filters.HireDatesLabel != "") {
                            var hs = $scope.filters.HireDatesLabel.split(" - ");
                            if (hs.length > 1) {
                                $scope.filters.hiredate = hs[0] + "," + hs[1];
                            }
                            else {
                                $scope.filters.hiredate = "";
                            }
                        }
                        else {
                            $scope.filters.hiredate = "";
                        }
                        filtersupdated = true;
                    }
                }
                if (valstr($("#dashboard_filterbuild", $scope.ARF.document).html()) != $scope.filters.Filterbuild) {
                    $scope.filters.Filterbuild = valstr($("#dashboard_filterbuild", $scope.ARF.document).html());
                    filtersupdated = true;
                }
                if (valstr($("#selPayperiods", $scope.ARF.document).val()) != $scope.filters.Payperiod) {
                    $scope.filters.Payperiod = valstr($("#selPayperiods", $scope.ARF.document).val());
                    $.cookie("Payperiod", $scope.filters.Payperiod); //Unifyme
                    var ps = $scope.filters.Payperiod.split(",");
                    if (ps.length >= 2) {
                        $scope.filters.StartDate = ps[0];
                        $scope.filters.EndDate = ps[1];
                        $.cookie("StartDate", $scope.filters.StartDate); //Unifyme
                        $.cookie("EndDate", $scope.filters.EndDate); //Unifyme
                    }
                    filtersupdated = true;
                }
                if (valstr($("#ReportReportList select", $scope.ARF.document).val()) != $scope.filters.cid) {
                    if ($scope.filters.cid != "") {
                        if ($scope.cidreload == "true") {
                            location.href = location.origin + location.pathname + '?prefix=' + a$.urlprefix().split(".")[0] + "&panelcid=" + valstr($("#ReportReportList select", $scope.ARF.document).val()).split("?")[0];
                            KILL_POLLING = true;
                            return;
                        }
                    }
                    $scope.filters.cid = valstr($("#ReportReportList select", $scope.ARF.document).val());
                    filtersupdated = true;
                    $.cookie("cid", $scope.filters.cid); //Unifyme
                }
                if ($scope.ARF.Selected.CSR != $scope.filters.Selected.CSR) {
                    $scope.filters.Selected.CSR = $scope.ARF.Selected.CSR;
                    filtersupdated = true;
                    $.cookie("SelectedCSR", $scope.ARF.Selected.CSR); //Unifyme
                }
                if ($("#poller_idlastmsg", $scope.ARF.document).html() != $scope.polling.idlastmsg) {
                    $scope.polling.idlastmsg = $("#poller_idlastmsg", $scope.ARF.document).html();
                    ko.postbox.publish("MessageReceived", { idmsg: $scope.polling.idlastmsg });
                }
                if ($("#poller_idlastmsgread", $scope.ARF.document).html() != $scope.polling.idlastmsgread) {
                    $scope.polling.idlastmsgread = $("#poller_idlastmsgread", $scope.ARF.document).html();
                    ko.postbox.publish("MessageRead", { idmsg: $scope.polling.idlastmsgread });
                }
                if ($("#poller_activetab", $scope.ARF.document).html() != $scope.polling.activetab) {
                    $scope.polling.activetab = $("#poller_activetab", $scope.ARF.document).html();
                    ko.postbox.publish("ActiveTabClicked", { tabtext: $scope.polling.activetab });
                }
                if ($("#poller_quickpublish", $scope.ARF.document).html() != "") { //TODO: Can expand upon this if we need params passed.
                    ko.postbox.publish($("#poller_quickpublish", $scope.ARF.document).html(), {});
                    $("#poller_quickpublish", $scope.ARF.document).html("");
                }

            } catch (e) { }
            if (filtersupdated) {
                try { ko.postbox.publish("Filters", $scope.filters); } catch (e) { };
            }
            if (plotted) {
                try { ko.postbox.publish("SearchClicked"); } catch (e) { };
            }
            setTimeout(checkfilters, 1000); //Less often means less bounce?
        }
        /*
        ko.postbox.subscribe("aGameXtremeLeaderboardLoad", function (json) {
        alert("test of aGameXtremeLeaderboardLoad");
        });
        */

        //Unlike filters, polling should not be called unless a change was made after instantiation.
        $scope.polling = {};
        try {
            $scope.polling.idlastmsg = $("#poller_idlastmsg", $scope.ARF.document).html();
            $scope.polling.idlastmsgread = $("#poller_idlastmsgread", $scope.ARF.document).html();
            $scope.polling.activetab = $("#poller_activetab", $scope.ARF.document).html();
            ko.postbox.subscribe("SetNavigation", function (o) {
                $("#poller_nav_com", $scope.ARF.document).html(JSON.stringify(o));
            });
        } catch (e) {
            alert("poller debug 1");
        }

        checkfilters();



        /*
        try { //Knockout may not be present, that's ok.

        ko.postbox.subscribe("Team", function (newValue) {
        if ($scope.filters.Team != newValue) {
        $scope.$apply(function () {
        $scope.filters.Team = newValue;
        });
        }
        });
        ko.postbox.subscribe("CSR", function (newValue) {
        if ($scope.filters.CSR != newValue) {
        $scope.$apply(function () {
        $scope.filters.CSR = newValue;
        });
        }
        });
        } catch (e) {
        //PATCH - For a control that doesn't have pubsub.  TODO: add pubsub to all filters.
        $scope.filters.Team = $.cookie("Team"); //Will be blank unless it was a parameter in a credentialed app.
        $scope.filters.CSR = $.cookie("CSR"); //Will be blank unless it was a parameter in a credentialed app.
        }
        */

        //jquery .ready late call
        if (a$.exists(document.legacyReady)) {
            var stop = $interval(function () {
                if ($scope.readyFilterSet) { //List all legacy-tethered directives
                    $interval.cancel(stop);
                    document.legacyReady();
                }
            }, 100);
        } else { //Native V3 may be getting passover parameters, but won't have to wait.
            if ($.cookie("CSR") != "") {
                $scope.filters.CSR = $.cookie("CSR");
            }
        }
    }
});

angularApp.service('hashtagnav', function () {

    this.init = function () {
        //---- HASHTAG NAVIGATION ------------------------------------------------------------------------------
        ShowHideNV(window.location.hash);
        window.addEventListener('hashchange', function () {
            ShowHideNV(window.location.hash);
        });
        function ShowHideNV(hashtag) {
            hashtag = hashtag.substring(1).toLowerCase(); //Remove the # for easy comparison
            $(".nv").hide();
            $(".nv").each(function () {
                var nv = $(this).attr("nv");
                if (nv != null) {
                    nvs = nv.split(";");
                    for (var h in nvs) {
                        //If the nv string begins with the same as the entire hashtag, then it get's shown.
                        //if (nvs[h].indexOf(hashtag) == 0) {
                        if (nvs[h] == hashtag) {
                            $(this).show();
                            break;
                        }
                        //hashtag = sidekick/summary/performance, nv = default:sidekick/summary   - Should not match (exact required).
                        //hashtag = sidekick/summary, nv = default:sidekick/summary   - Should match.
                        else if (nvs[h].indexOf("default:") == 0) {
                            var tnv = nvs[h].substring("default:".length);
                            if (tnv == hashtag) {
                                $(this).show();
                                break;
                            }
                        }
                        //hashtag = sidekick/summary/performance, nv = sidekick/summary - Should match, upstream match.
                        else if (hashtag.length > nvs[h].length) {
                        		if (nvs[h].length > 0) {
                            	if (hashtag.indexOf(nvs[h]) == 0) {
                              	  $(this).show();
                                	break;
                            	}                        			
                        		}
                        }
                    }
                }
            });
        }
    }
});


angularApp.service('api', function () {
    this.getJS = function (data) {
        return this.doJS(data, "GET");
    }
    this.postJS = function (data) {
        return this.doJS(data, "POST");
    }

    this.stripNG = function (o) {
        return JSON.parse(JSON.stringify(o), function (k, v) {
            if (v && typeof v === 'object') {
                return Object.assign(Object.create(null), v);
            }
            return v;
        });
    }

    this.doJS = function (data, sendtype, notasync, params) { //getJS, postJS, getCP, postCP ?  Truly haven't decided yet.
        var a = {
            type: sendtype,
            service: "JScript",
            async: true,
            data: data,
            dataType: "json",
            cache: false,
            params: params
        };
        if (notasync) {
            a.async = false;
        }
        var loc = window.location.host;
        if (loc.indexOf("localhost", 0) < 0) {
            loc = window.location.protocol + '//' + window.location.host + "/";
        } else {
            loc = window.location.protocol + '//' + window.location.host;
            loc += appLib.xss(window.location.pathname).substr(0, appLib.xss(window.location.pathname).indexOf(".com") + 5);
        }
        a.url = loc;

        if (!a.service) {
            //alert("debug: No Service Specified - calling C#");
            a.service = "C#";
        }
        if (a.service == "C#") {
            a.url += "ajaxjson.ashx";
        } else if (a.service == "JScript") {
            a.url += "jshandler.ashx";
        } else {
            alert("Invalid Service: " + a.service);
            a.url += "ajaxjson.ashx";
        }
        if (a$.exists(a.params)) {
            a.url += "?" + a.params;
        }
        if (!a.data.uname) {
            if (!a.data.auth) a.data.auth = { username: a$.xss($.cookie("username")), uid: a$.xss($.cookie("uid")) }; //was: appLib.secobj();
        }
        var prefixfound = false;
        if (a$.exists(a.params)) {
            prefixfound = (a.params.indexOf("prefix=") >= 0);
        }
        if (a$.exists(a.data.prefix)) prefixfound = true;
        if (!prefixfound) {
            a.data.prefix = a$.urlprefix().split(".")[0];
        }

        return new Promise(function (resolve) {
            a.success = function (json) {
                a$.jsonerror(json); //Display the error if any.
                resolve(json);
            };
            a.error = a$.ajaxerror;
            $.ajax(a);
        });
    }

    var me = this;

    //NEW WAY - The ME object.  This is in the 'api' for now, should it be it's own service?

    var gettingme = false;
    var meready = false;
    this.getMe = function (o) {
        if (typeof o != "object") {
            alert("No object passed to getMe");
        }
        if (!o.who) o.who = "ME";
        if (!o.members) o.members = [];

        if (!gettingme) {
            gettingme = true;
            var data = {
                lib: "spine",
                cmd: "getMe", //TODO: Can split out into separate calls.
                members: o.members,
                who: o.who,
                agentid: o.agentid, //smh..
                CSR: o.CSR, //smh..
                Team: o.Team, //smh..
                lookback: o.lookback //smh..
            };
            data.avatarfolderroot = a$.exists(o.avatarfolderroot) ? o.avatarfolderroot : "";
            return new Promise(function (resolve) {
                me.getJS(data).then(function (json) {
                    me.me = json.me;
                    meready = true;
                    resolve(me);
                });
            });
        }
        else {
            return new Promise(function (resolve) {
                function readytest() {
                    if (!meready) {
                        setTimeout(readytest, 100);
                    }
                    else {
                        resolve(me);
                    }
                }
                readytest();
            });
        }
    }

    //Similarly, the client object.

    var gettingclient = false;
    var clientready = false;
    this.getClient = function (o) {
        if (typeof o != "object") {
            alert("No object passed to getClient");
        }
        if (!o.who) o.who = "ME";
        if (!o.members) o.members = [];

        if (!gettingclient) {
            gettingclient = true;
            var data = {
                lib: "spine",
                cmd: "getClient", //TODO: Can split out into separate calls.
                members: o.members,
                idtype: o.who
            };
            if (a$.exists(o.restrictusers)) {
                data.restrictusers = o.restrictusers;
            }
            return new Promise(function (resolve) {
                me.getJS(data).then(function (json) {
                    me.client = json.client;
                    clientready = true;
                    resolve(me);
                });
            });
        }
        else {
            return new Promise(function (resolve) {
                function readytest() {
                    if (!clientready) {
                        setTimeout(readytest, 100);
                    }
                    else {
                        resolve(me);
                    }
                }
                readytest();
            });
        }
    }

});

// DIRECTIVES

// SPECIAL DIRECTIVE - All directives that need access to the legacy scope need to be inside this directive.
angularApp.directive("ngLegacyContainer", function () {
    return {
        //template: '<div style="height:600px;width:600px;"></div>',
        controller: function ($scope) {
            this.scope = $scope;
        }
    };
});

