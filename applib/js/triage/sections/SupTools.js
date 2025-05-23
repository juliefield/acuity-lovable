/************
appApmSupTools
1.0.1 - Conversion to use Knockout (this is Jeff's first Knockout code).
************/

(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    var contextmenuHOLD;

    var SupTools_KPIsModel = function(kpiparam) {
        this.kpis = kpiparam;
    };
    var SupTools_viewModel = {
        heading: ko.observable(),
        cards: ko.observable()
    };
    var SupTools_bound = false;

    function init() {
        var showContextMenu = false;
        var showMissingKPITable = false;
        var showKPICards = true;

        var bld;
        SupTools_viewModel.heading("Loading...");
        SupTools_viewModel.cards({});

        if ($("#StgDashboard select").val()!="Agent") {
            SupTools_viewModel.heading("Tools are currently only available for the Agent dashboard.");
            return;
        }
        //SupTools_viewModel.cards(new SupTools_KPIsModel([{text: "Loading..."}]));

        contextmenuHOLD = window.oncontextmenu;
        if (showContextMenu) {
            $(".SupTools").hover(function() {
                window.oncontextmenu = function() { return false; };
            }, function() {
                 window.oncontextmenu = contextmenuHOLD;
            });
        }
        //TODO: ko.postbox.publish appApmDashboard.viewparams if the dashboard ever becomes a viewmodel (For the life of me, I don't understand why this would be better, I guess I'm still a noob.)
        a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "suptools", cmd: "getteaminfo", toolslevel: $("#StgToolsLevel select").val(), model: $("#StgDashboard select").val(), role: $.cookie("TP1Role"),  /*project: $("#selProjects").val(), team: $("#selTeams").val()*/ },
            params: appApmDashboard.viewparams(0, true), dataType: "json", cache: false, error: a$.ajaxerror, success: loaded
        });
        function loaded(json) {
            if (a$.jsonerror(json)) {
            }
            else {
                sup = json;

                if (showMissingKPITable) {
                    //Crunch out the missing kpis, store them with the kpis array.
                    var active = 0;
                    var intraining = 0;
                    for (var i in sup.members) {
                        if (sup.members[i].status=='Active') {
                            active +=1;
                        }
                        else {
                            intraining +=1;
                        }
                    }
                    for (var i in sup.kpis) {
                        sup.kpis[i].missing={};
                        sup.kpis[i].missing.active = 0;
                        sup.kpis[i].missing.intraining = 0;
                        for (var j in sup.members) {
                            var found = false;
                            for (var k in sup.members[j].kpis) {
                                if (sup.kpis[i].val == sup.members[j].kpis[k].val) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                if (sup.members[j].status=='Active') {
                                    sup.kpis[i].missing.active+=1;
                                }
                                else {
                                    sup.kpis[i].missing.intraining+=1;
                                }
                            }
                        }
                    }
                    //Build the table
                    var bld='<thead><tr><th>Agent Status</th><th>Agent Count</th>';
                    for (var i in sup.kpis) {
                        bld += '<th>' + sup.kpis[i].text + '</th>';
                    }
                    bld += '</tr></thead><tbody><tr><td>Active</td>';
                    bld += '<td>' + active + '</td>';
                    for (var i in sup.kpis) {
                        if (sup.kpis[i].missing.active > 0) {
                            bld += '<td class="sup-MissingKPIAgentDrill"><span>A/' + sup.kpis[i].val + '</span>' + sup.kpis[i].missing.active + '</td>';
                        }
                        else {
                            bld += '<td>' + sup.kpis[i].missing.active + '</td>';
                        }
                    }
                    bld += '</tr><tr><td>In Training</td>';
                    bld += '<td>' + intraining + '</td>';
                    for (var i in sup.kpis) {
                        if (sup.kpis[i].missing.intraining > 0) {
                            bld += '<td class="sup-MissingKPIAgentDrill"><span>I/' + sup.kpis[i].val + '</span>' + sup.kpis[i].missing.intraining + '</td>';
                        }
                        else {
                            bld += '<td>' + sup.kpis[i].missing.intraining + '</td>';
                        }
                    }
                    bld += '</tr></tbody>';
                    $(".sup-MissingKPI table").html(bld);
                    $(".sup-MissingKPIAgents").html("");
                    $(".sup-MissingKPI").show();
                }
                else {
                    $(".sup-MissingKPI").hide();
                }

                if (showKPICards) {
                    //$(".SupTools").append('<div class="sup-KPICards"></div>');
                    //Create a card for each KPI "sup-KPICards"

                    var showraw = false;
                    //TODO: Make showing of raw scores a setting (note: dbo.dspBarValue needs to exist for it to work).
                    if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.")) {
                        showraw = true;
                    }

                    for (var i in sup.kpis) {
                        var kpi = sup.kpis[i].val;
                        var srt = [];
                        for (var j in sup.members) {
                            var found = false;
                            var myk;
                            for (var k in sup.members[j].kpis) {
                                if (sup.members[j].kpis[k].val == kpi) {
                                    found = true;
                                    myk = k;
                                }
                            }
                            if (found) {
                                srt.push({ member: sup.members[j], score: sup.members[j].kpis[myk].score });
                            }
                            else {
                                srt.push({ member: sup.members[j], score: -1000 });
                            }
                        }
                        srt.sort(function(a,b){ return (b.score == a.score ? (b.member.displayname > a.member.displayname ? -1 : 1) : b.score - a.score)});

                        for (var j in srt) {
                            var c = appApmDashboard.perfcolor(srt[j].score); //TODO: ko.postbox.publish this if the dashboard ever becomes a viewmodel
                            var color;
                            var score;
                            if (srt[j].score == -1000) {
                                color = "transparent";
                                score = "Missing";
                            }
                            else {
                                if (showraw) {
                                    color = "transparent";
                                }
                                else {
                                    color = c.stops[2][1];
                                }
                                score = (Math.round(srt[j].score * 100.0) / 100.0);
                            };
                            srt[j].displaystatus = (srt[j].member.status!="Active") ? "T" : ""; 
                            //Do this sesrver side: srt[j].displayname = srt[j].member.last + ', ' + srt[j].member.first + ' (' + srt[j].member.uid + ')';
                            srt[j].displayname = srt[j].member.displayname;
                            srt[j].displayscore = score;
                            srt[j].displaycolor = color;
                        }
                        sup.kpis[i].srt = srt;
                    }
                    SupTools_viewModel.heading(sup.heading);
                    SupTools_viewModel.cards(new SupTools_KPIsModel(sup.kpis));
                    $(".sup-KPICards").show();
                }
                else {
                    $(".sup-KPICards").hide();
                }

                if (!SupTools_bound) {
                    ko.applyBindings(SupTools_viewModel,$(".SupTools")[0]);
                    SupTools_bound = true;
                }

                //Late Bindings
                if (showMissingKPITable) {
                    $(".sup-MissingKPIAgentDrill").bind("mouseover",function() {
                        var bld = "";
                        var argss = $(" span",this).html();
                        args = argss.split("/");
                        for (var j in sup.members) {
                            if ((sup.members[j].status=='Active' && args[0]=='A')||(sup.members[j].status=='In Training' && args[0]=='I')) {
                                var found = false;
                                for (var k in sup.members[j].kpis) {
                                    if (args[1] == sup.members[j].kpis[k].val) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    bld += sup.displayname + '&nbsp;&nbsp;&nbsp;';
                                }
                            }
                        }
                        //alert("debug:" + $(" span",this).html());
                        $(".sup-MissingKPIAgents").html(bld);
                    });
                }
                if (showKPICards) {
                    $(".sup-KPICardHeader").unbind().bind("mouseenter",function() {
                        $(this).addClass("sup-cardheader-hover");
                    }).bind("mouseleave",function() {
                        $(this).removeClass("sup-cardheader-hover");
                    }).bind("dblclick",function() {
                        var kpitext = $(this).html();
                        if (kpitext == "Balanced") {
                            $("#selKPIs").val("").trigger("liszt:updated");
                        }
                        else {
                            for (var i in sup.kpis) {
                                if (sup.kpis[i].text == kpitext) {
                                    $("#selKPIs").val(sup.kpis[i].val).trigger("liszt:updated");
                                    break;                                    
                                }
                            }
                        }
                        switch (sup.toolscope) {
                            case "Project":
                                $("#selProjects").val(sup.toolscopeid).trigger("liszt:updated");
                                $("#selLocations").val("").trigger("liszt:updated");
                                $("#selGroups").val("").trigger("liszt:updated");
                                $("#selTeams").val("").trigger("liszt:updated");
                                $("#selCSRs").val("").trigger("liszt:updated");
                                break;
                            case "Location":
                                $("#selLocations").val(sup.toolscopeid).trigger("liszt:updated");
                                $("#selGroups").val("").trigger("liszt:updated");
                                $("#selTeams").val("").trigger("liszt:updated");
                                $("#selCSRs").val("").trigger("liszt:updated");
                                break;
                            case "Group":
                                $("#selGroups").val(sup.toolscopeid).trigger("liszt:updated");
                                $("#selTeams").val("").trigger("liszt:updated");
                                $("#selCSRs").val("").trigger("liszt:updated");
                                break;
                            case "Team":
                                $("#selTeams").val(sup.toolscopeid).trigger("liszt:updated");
                                $("#selCSRs").val("").trigger("liszt:updated");
                                break;
                        }
                        $("#sel" + $("#StgToolsLevel select").val() + "s").val("each").trigger("liszt:updated");
                        //WAS: appApmDashboard.plotme(0, true, true);
                        ko.postbox.publish("PLOT_FROM_TOOLS",{});
                    });
                    $(".sup-KPICardMember").unbind().bind("mouseenter",function() {
                        if (showContextMenu) { $(".sup-contextmenu").remove(); };
                        $(this).addClass("sup-hover");
                    }).bind("mouseleave",function() {
                        $(this).removeClass("sup-hover");
                    }).bind("mousedown",function(e) {
                        if (e.button == 2) {
                            if (showContextMenu) {
                                $(".sup-contextmenu").remove();
                                $("body").append('<div class="sup-contextmenu" style="top:' + e.pageY + 'px;left:' + e.pageX + 'px;"><table><tr><td>View KPI Details</td></tr><tr><td>IM Agent</td></tr><tr><td>Message Agent</td></tr><tr><td>Create Note</td></tr><tr><td>Create Alert</td></tr><tr><td>Open Action Log</td></tr></table></div>');
                                $(".sup-contextmenu").hover(function() {
                                    window.oncontextmenu = function() { return false; };
                                });
                                $(".sup-contextmenu table tr").unbind().bind("mouseenter",function() {
                                    $(this).addClass("sup-hover");
                                }).bind("mouseleave",function() {
                                    $(this).removeClass("sup-hover");
                                });
                                return false;
                            }
                        }
                    }).bind("dblclick",function() {
                        var uid = $(".sup-memberuid",this).html();
                        if (uid) {
                            switch ( $("#StgToolsLevel select").val()) {
                                case "Location":
                                    $("#selCSRs").val("").trigger("liszt:updated");
                                    $("#selTeams").val("").trigger("liszt:updated");
                                    $("#selGroups").val("").trigger("liszt:updated");
                                    $("#selLocations").val(uid).trigger("liszt:updated");
                                    break;
                                case "Group":
                                    $("#selCSRs").val("").trigger("liszt:updated");
                                    $("#selTeams").val("").trigger("liszt:updated");
                                    $("#selGroups").val(uid).trigger("liszt:updated");
                                    break;
                                case "Team":
                                    $("#selCSRs").val("").trigger("liszt:updated");
                                    $("#selTeams").val(uid).trigger("liszt:updated");
                                    break;
                                case "CSR":
                                    $("#selCSRs").val(uid).trigger("liszt:updated");
                                    break;
                                default:
                            }
                            $("#selKPIs").val("each").trigger("liszt:updated");
                            //WAS: appApmDashboard.plotme(0, true, true);
                            ko.postbox.publish("PLOT_FROM_TOOLS",{});
                        }
                    });
                }

            }
        }
    }

    function exists(me) {
        return (typeof me != 'undefined');
    }

    // global variables
    window.appApmSupTools = {
        //filter-related (could be split out at some point)
        init: init
    };
})();