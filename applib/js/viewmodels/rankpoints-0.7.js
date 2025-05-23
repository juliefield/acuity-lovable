/************
appApmDashboard - Graph/Table/Gauge App
Changes for 2.1
- added success: member to refreshboxes (del will still work).
- payperiodrestrict will be ignored for now.
- each for payperiod comes from the filtercontext, not hard coded.
2.6.6 - Added ivtype to payperiod.
2.6.4 - Color rectification for overlay.
2.6.3 - Overlay Buildout
2.6.2 - Variable performance thresholds.
2.6.0 - Integration with legacy Reports and Charts
2.5.0 - Guatemala Pay Display
2.6.7 - Major filtering fix (will make reports run much faster)
2.6.8 - Ranking engine with new gauge.
Converted to a viewmodel
0.3 - Guatemala added
0.7 - Fix the NaN problem on the ledger total.
************/

(function() {
    if (!window.jQuery) {
        alert("This App requires jQuery");
        return;
    }
    var $ = window.jQuery;

    var prizeinitq = false;

    var gemTheme = "Treasure Hunt"; //Bridge to identify when to apply the "Gem" Styles.

    var gems = {
        crowns: 0,
        diamonds: 0,
        rubies: 0,
        emeralds: 0,
        sapphires: 0,
        coins: 0,
        other: 0
    };

    var guatCUT = false; //Used for Guatemala (ers) to halve the points.  TODO: They need their own prize table, and it should also be a setting.
    var pdx = 0;

    var ISSUP = false;
    var supervisor = "";

    function supinit(sup, pointsbalance) {
        ISSUP = true;
        supervisor = sup;
        commoninit(pointsbalance);
    }

    function csrinit(pointsbalance) {
        ISSUP = false;
        commoninit(pointsbalance);
    }

    function commoninit(pointsbalance) {
        var labPoints = "Points";
        /* //NO guatCUT - We're just going to have a separate table of prizes.
        if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "make.")) {
        if ($("#selLocations").val() == "9") {
        if (!guatCUT) {
        for (var i in prizes.table) {
        prizes.table[i].points = parseInt(prizes.table[i].points / 2, 10);
        }
        prizeinitq = false;
        }
        guatCUT = true;
        }
        else {
        if (guatCUT) {
        for (var i in prizes.table) {
        prizes.table[i].points = parseInt(prizes.table[i].points * 2, 10);
        }
        prizeinitq = false;
        }
        guatCUT = false;
        }
        }
        */
        //if (!prizeinitq) {
        //    prizetableinit(".CEPointsPrizes");
        //    prizeinitq = true;
        //}
        function getledger(location) {
            pdx = 0;
            if (location == 9) pdx = 1;
            var csr;
            if (ISSUP) {
                csr = supervisor;
            } else {
                csr = $("#selCSRs option:selected").val();
            }
            if (stgRankPointsLabel == gemTheme) {
                $(".CEPointsLegend-TreasureHunt-scoreboard").html("");
            }
            a$.ajax({
                type: "GET",
                service: "JScript",
                async: true,
                data: {
                    lib: "pay",
                    cmd: "points.csrledger",
                    csr: csr
                },
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: loaded
            });

            function loaded(json) {
                if (a$.jsonerror(json)) {} else {
                    prizetableinit(".CEPointsPrizes", json.location);
                    var inj = "<tr><td>Date</td><td>Description</td><td>Amount</td><td>Balance</td></tr>";
                    if (stgRankPointsLabel == gemTheme) {
                        inj = "<tr><td>Date</td><td>Description</td><td>Coins</td><td>Balance</td></tr>"
                    }
                    var redeemInj = '<p>You currently have a total of <b><span class="CEPointsBalance"></span></b> <span class="labPointsLower">points</span> <span class="CEPointsInstructions"></span></p><span class="labPointsUpper">Points</span> to Redeem: <input id="CEPointsRedeemAmount" type="text" style="width:50px;" disabled="disabled" value="' + prizes[pdx].table[0].points + '" /> <select id="CEPointsRedemptionType"><option value="">--select redemption type--</option><option value="Cash">Cash</option><option value="Prize">Prize</option><option value="Give">Give</option></select> <input id="CEPointsRedeem" type="button" disabled="disabled" value="Redeem" />';
                    var pb = 0;
                    for (var i in json.ledger) {
                        pb += json.ledger[i].amount;
                        inj += "<tr><td>" + json.ledger[i].date + "</td><td>" + json.ledger[i].desc + "</td><td>" + json.ledger[i].amount + "</td><td>" + pb + "</td></tr>";
                        json.ledger[i].balance = pb;
                    }
                    if (stgRankPointsLabel == gemTheme) {
                        //Generate Gems (read up through the ledger until you reach a redemption.  The balance at time of redemption is the Coins)
                        redeemInj = '<p>You currently have treasure with a total value of <b><span class="CEPointsBalance"></span></b> <span class="labPointsLower">points</span><span class="CEPointsInstructions"></span></p><span class="labPointsUpper">Points</span> to Redeem: <input id="CEPointsRedeemAmount" type="text" style="width:50px;" disabled="disabled" value="' + prizes[pdx].table[0].points + '" /> <select id="CEPointsRedemptionType"><option value="">--select redemption type--</option><option value="Cash">Cash</option><option value="Prize">Prize</option><option value="Give">Give</option></select> <input id="CEPointsRedeem" type="button" disabled="disabled" value="Redeem" />';
                        gems.crowns = 0;
                        gems.diamonds = 0;
                        gems.rubies = 0;
                        gems.emeralds = 0;
                        gems.sapphires = 0;
                        gems.coins = 0;
                        gems.other = 0;
                        var blds = ""; //Sequential Build
                        if (json.location == 9) {
                            var bld = "";
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-1-left"><span style="color:white;">A+</span> :&nbsp;&nbsp;&nbsp;&nbsp;Crown Level</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-1-right">x 200</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-2-left"><span style="color:white;">A</span> :&nbsp;&nbsp;&nbsp;&nbsp;Diamond Level</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-2-right">x 150</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-3-left"><span style="color:white;">B+</span> :&nbsp;&nbsp;&nbsp;&nbsp;Ruby Level</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-3-right">x 100</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-4-left"><span style="color:white;">B</span> :&nbsp;&nbsp;&nbsp;&nbsp;Emerald Level</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-4-right">x 50</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-5-left"><span style="color:white;">C</span> :&nbsp;&nbsp;&nbsp;&nbsp;Sapphire Level</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-5-right">x 10</div>';
                            $(".CEPointsLegend-TreasureHunt-scoreboard").html(bld);
                        } else {
                            var bld = "";
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-1-left"><span style="color:white;">Base+3</span> : Crown Level</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-1-right">x 80</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-2-left"><span style="color:white;">Base+2</span> : Diamond Level</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-2-right">x 60</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-3-left"><span style="color:white;">Base+1</span> : Ruby Level</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-3-right">x 40</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-4-left"><span style="color:white;">&nbsp;Base&nbsp;</span> : Emerald Level</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-4-right">x 20</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-5-left"><span style="color:white;">&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> Sapphire Level</div>';
                            bld += '<div class="CEPointsLegend-TreasureHunt-score-5-right">x 5</div>';
                            $(".CEPointsLegend-TreasureHunt-scoreboard").html(bld);
                        }
                        for (var i = json.ledger.length - 1; i >= 0; i--) {
                            if (json.ledger[i].amount < 0) { //redemption
                                gems.coins += json.ledger[i].balance;
                                break;
                            } else {
                                if (json.location == 9) { //TODO: This needs to be a setting, of course.  Also, if other projects use this with a location of 9, obviously.
                                    switch (json.ledger[i].amount) {
                                        case 200:
                                            blds = '<div class="CEPoints-gem CEPoints-gem-crown">&nbsp;<span class="CEPoints-gem-tip">' + json.ledger[i].desc.replace("Points Award", "<b>Crown (" + json.ledger[i].amount + " Coins)</b>") + '</span></div>' + blds;
                                            gems.crowns += 1;
                                            break;
                                        case 150:
                                            blds = '<div class="CEPoints-gem CEPoints-gem-diamond">&nbsp;<span class="CEPoints-gem-tip">' + json.ledger[i].desc.replace("Points Award", "<b>Diamond (" + json.ledger[i].amount + " Coins)</b>") + '</span></div>' + blds;
                                            gems.diamonds += 1;
                                            break;
                                        case 100:
                                            blds = '<div class="CEPoints-gem CEPoints-gem-ruby">&nbsp;<span class="CEPoints-gem-tip">' + json.ledger[i].desc.replace("Points Award", "<b>Ruby (" + json.ledger[i].amount + " Coins)</b>") + '</span></div>' + blds;
                                            gems.rubies += 1;
                                            break;
                                        case 50:
                                            blds = '<div class="CEPoints-gem CEPoints-gem-emerald">&nbsp;<span class="CEPoints-gem-tip">' + json.ledger[i].desc.replace("Points Award", "<b>Emerald (" + json.ledger[i].amount + " Coins)</b>") + '</span></div>' + blds;
                                            gems.emeralds += 1;
                                            break;
                                        case 10:
                                            blds = '<div class="CEPoints-gem CEPoints-gem-sapphire">&nbsp;<span class="CEPoints-gem-tip">' + json.ledger[i].desc.replace("Points Award", "<b>Sapphire (" + json.ledger[i].amount + " Coins)</b>") + '</span></div>' + blds;
                                            gems.sapphires += 1;
                                            break;
                                        default:
                                            gems.coins += json.ledger[i].amount; //Just put odd ones in "coins", you could distinguish with gems.other, but it will work out.
                                    }
                                } else {
                                    switch (json.ledger[i].amount) {
                                        case 100:
                                        case 80:
                                            blds = '<div class="CEPoints-gem CEPoints-gem-crown">&nbsp;<span class="CEPoints-gem-tip">' + json.ledger[i].desc.replace("Points Award", "<b>Crown (" + json.ledger[i].amount + " Coins)</b>") + '</span></div>' + blds;
                                            gems.crowns += 1;
                                            break;
                                        case 75:
                                        case 60:
                                            blds = '<div class="CEPoints-gem CEPoints-gem-diamond">&nbsp;<span class="CEPoints-gem-tip">' + json.ledger[i].desc.replace("Points Award", "<b>Diamond (" + json.ledger[i].amount + " Coins)</b>") + '</span></div>' + blds;
                                            gems.diamonds += 1;
                                            break;
                                        case 50:
                                        case 40:
                                            blds = '<div class="CEPoints-gem CEPoints-gem-ruby">&nbsp;<span class="CEPoints-gem-tip">' + json.ledger[i].desc.replace("Points Award", "<b>Ruby (" + json.ledger[i].amount + " Coins)</b>") + '</span></div>' + blds;
                                            gems.rubies += 1;
                                            break;
                                        case 25:
                                        case 20:
                                            blds = '<div class="CEPoints-gem CEPoints-gem-emerald">&nbsp;<span class="CEPoints-gem-tip">' + json.ledger[i].desc.replace("Points Award", "<b>Emerald (" + json.ledger[i].amount + " Coins)</b>") + '</span></div>' + blds;
                                            gems.emeralds += 1;
                                            break;
                                        case 5:
                                            blds = '<div class="CEPoints-gem CEPoints-gem-sapphire">&nbsp;<span class="CEPoints-gem-tip">' + json.ledger[i].desc.replace("Points Award", "<b>Sapphire (" + json.ledger[i].amount + " Coins)</b>") + '</span></div>' + blds;
                                            gems.sapphires += 1;
                                            break;
                                        default:
                                            gems.coins += json.ledger[i].amount; //Just put odd ones in "coins", you could distinguish with gems.other, but it will work out.
                                    }
                                }
                            }
                        }
                        if (gems.coins > 0) {
                            blds += '<div class="CEPoints-gem CEPoints-gem-coin">' + gems.coins + '<span class="CEPoints-gem-tip">Other Coins - Forwarded Balances &amp; Adjustments.</span></div>';
                        }

                        var bld = ""; //Each gem with count of each
                        var bldv = ""; //Verbose gems (each showing)
                        var bldc = ""; //Crown Only with total coins

                        bldc = '<div class="CEPoints-gem CEPoints-gem-crown CEPoints-gem-crown-icon"><span>' + json.ledger[json.ledger.length - 1].balance + '</span></div>';
                        if (gems.crowns > 0) {
                            for (var i = 0; i < gems.crowns; i++) bldv += '<div class="CEPoints-gem CEPoints-gem-crown">&nbsp;</div>';
                            bld += '<div class="CEPoints-gem CEPoints-gem-crown">' + (gems.crowns > 1 ? gems.crowns : "&nbsp;") + '</div>';
                        }
                        if (gems.diamonds > 0) {
                            for (var i = 0; i < gems.diamonds; i++) bldv += '<div class="CEPoints-gem CEPoints-gem-diamond">&nbsp;</div>';
                            bld += '<div class="CEPoints-gem CEPoints-gem-diamond">' + (gems.diamonds > 1 ? gems.diamonds : "&nbsp;") + '</div>';
                        }
                        if (gems.rubies > 0) {
                            for (var i = 0; i < gems.rubies; i++) bldv += '<div class="CEPoints-gem CEPoints-gem-ruby">&nbsp;</div>';
                            bld += '<div class="CEPoints-gem CEPoints-gem-ruby">' + (gems.rubies > 1 ? gems.rubies : "&nbsp;") + '</div>';
                        }
                        if (gems.emeralds > 0) {
                            for (var i = 0; i < gems.emeralds; i++) bldv += '<div class="CEPoints-gem CEPoints-gem-emerald">&nbsp;</div>';
                            bld += '<div class="CEPoints-gem CEPoints-gem-emerald">' + (gems.emeralds > 1 ? gems.emeralds : "&nbsp;") + '</div>';
                        }
                        if (gems.sapphires > 0) {
                            for (var i = 0; i < gems.sapphires; i++) bldv += '<div class="CEPoints-gem CEPoints-gem-sapphire">&nbsp;</div>';
                            bld += '<div class="CEPoints-gem CEPoints-gem-sapphire">' + (gems.sapphires > 1 ? gems.sapphires : "&nbsp;") + '</div>';
                        }
                        if (gems.coins > 0) {
                            //for (var i = 0; i < gems.coins; i++) bldv += '<div class="CEPoints-gem CEPoints-gem-coin">&nbsp;</div>';
                            bldv += '<div class="CEPoints-gem CEPoints-gem-coin">' + gems.coins + '</div>';
                            bld += '<div class="CEPoints-gem CEPoints-gem-coin">' + gems.coins + '</div>';
                        }
                        if (gems.other > 0) {
                            bld += " + " + gems.other + " Other(Unknown)";
                        }
                        $(".CEPointsLegend-TreasureHunt-gemsRegister").html(blds);
                        $(".CEPoints-gem").unbind().bind("mouseover", function() {
                            $(".CEPointsLegend-TreasureHunt-gem-tip").html($("span", this).html());
                        }).bind("mouseout", function() {
                            $(".CEPointsLegend-TreasureHunt-gem-tip").html("Mouse over gems for more information.");
                        });
                        labPoints = "Coins";
                        $(".CEPoints-redeem-TreasureHunt").html(redeemInj);
                        $(".labPointsLower").html(labPoints.toLowerCase());
                        $(".labPointsUpper").html(labPoints);
                        $(".headericon-points").css("width", "400px").css("text-align", "right").html(bldc);
                        $(".CEPointsLegend-default").hide();
                        $(".CEPointsLegend-TreasureHunt").show();
                        $(".CEPointsRegister-wrapper").css("margin-top", "610px").css("margin-left", "0px").css("min-height", "0px");
                        $(".CEPointsRegister-innerwrapper").hide();
                        $(".CEPointsRegister-expand").show();
                        $(".CEPointsRegisterExpand").unbind().bind("click", function() {
                            if ($(this).html() == "Show Coins Register") {
                                $(".CEPointsRegister-innerwrapper").show();
                                $(this).html("Hide Coins Register");
                            } else {
                                $(".CEPointsRegister-innerwrapper").hide();
                                $(this).html("Show Coins Register");
                            }
                            return false;
                        });
                    } else {
                        $(".headericon-points-balance").html(pb);
                        $(".CEPoints-redeem-default").html(redeemInj);
                        $(".CEPointsLegend-default").show();
                        $(".CEPointsLegend-TreasureHunt").hide();
                    }

                    $(".CEPointsRegister table").empty().append(inj);
                    if (ISSUP) {
                        $(".CEPointsName").html(supervisor);
                    } else {
                        var sp = $("#selCSRs option:selected").text().split(",");
                        $(".CEPointsName").html(sp[1] + "&nbsp;" + sp[0]);
                    }
                    $(".CEPointsBalance").html(pb);
                    var cepointsthreshold = prizes[pdx].table[0].points; //TODO: Make the threshold for redemption a setting stg
                    if (pb < cepointsthreshold) {
                        $(".CEPointsInstructions").html(". When you reach a <br />minimum value of " + prizes[pdx].table[0].points + " " + labPoints.toLowerCase() + " you are eligible to redeem.");
                        $("#CEPointsRedeem,#CEPointsRedeemAmount").prop("disabled", true);
                        $(".CEPoints-peak-1").html("Accumulate " + prizes[pdx].table[0].points + " coins to be eligible for <b>" + prizes[pdx].table[0].Cash + "</b> in cash, or the following prize:<br /><b>" + prizes[pdx].table[0].Prize + "</b>");
                        $(".CEPoints-peak-2").html("");
                        $(".CEPoints-peak-higher").html("..or continue saving coins to become eligible for<br /><b>more cash and bigger prizes as listed below!</b>");
                    } else {
                        var curi = -1;
                        for (var i in prizes[pdx].table) {
                            if (pb >= prizes[pdx].table[i].points) {
                                curi = parseInt(i, 10);
                                break;
                            }
                        }
                        $(".CEPoints-peak-1").html("You are currently eligible to redeem " + prizes[pdx].table[curi].points + " coins to receive either <b>" + prizes[pdx].table[curi].Cash + "</b> in cash, or the following prize:<br /><b>" + prizes[pdx].table[curi].Prize + "</b>");
                        if (curi > -1) {
                            $(".CEPoints-peak-2").html("..or continue saving and accumulate " + prizes[pdx].table[curi + 1].points + " coins to be eligible for <b>" + prizes[pdx].table[curi + 1].Cash + "</b> in cash, or the following prize:<br /><b>" + prizes[pdx].table[curi + 1].Prize + "</b>");
                            $(".CEPoints-peak-higher").html("..or continue saving coins to become eligible for<br /><b>more cash and bigger prizes as listed below!</b>");
                        } else {
                            $(".CEPoints-peak-2").html("");
                            $(".CEPoints-peak-higher").html("");
                        }

                        $(".CEPointsInstructions").html("!<br />You may redeem your " + labPoints.toLowerCase() + ", or save them for a future purchase.");
                        $("#CEPointsRedeem,#CEPointsRedeemAmount").prop("disabled", false);
                        var unclicked = true;
                        $("#CEPointsRedeem").unbind().bind("click", function() {
                            if (!unclicked) {
                                return false;
                            }
                            //TODO: Load the redemption types as settings stg
                            if ($("#CEPointsRedemptionType option:selected").val() == "") {
                                alert("Please select a redemption type.");
                            } else if (!$.isNumeric($("#CEPointsRedeemAmount").val())) {
                                alert(labPoints + " to Redeem must be a number.");
                            } else if (parseInt($("#CEPointsRedeemAmount").val(), 10) < cepointsthreshold) {
                                alert("You must redeem at least " + cepointsthreshold + " " + labPoints.toLowerCase() + ".");
                            } else if (parseInt($("#CEPointsRedeemAmount").val(), 10) > pb) {
                                alert("You can't redeem more than your current balance of " + pb + " " + labPoints.toLowerCase() + ".");
                            } else {
                                unclicked = false;
                                $(this).unbind(); //ADDED: 2015-12-18 - Disable and HIDE the button the instant it is pressed.
                                $(this).hide();
                                var csr;
                                if (ISSUP) {
                                    csr = supervisor;
                                } else {
                                    csr = $("#selCSRs option:selected").val();
                                }

                                a$.ajax({
                                    type: "GET",
                                    service: "JScript",
                                    async: false,
                                    data: {
                                        lib: "pay",
                                        cmd: "points.redeem",
                                        csr: csr,
                                        amount: "" + (-parseInt($("#CEPointsRedeemAmount").val(), 10)),
                                        redeemtype: $("#CEPointsRedemptionType option:selected").val(),
                                        redeemtext: $("#CEPointsRedemptionType option:selected").text()
                                    },
                                    dataType: "json",
                                    cache: false,
                                    error: a$.ajaxerror,
                                    success: loaded
                                });

                                function loaded(json) {
                                    if (a$.jsonerror(json)) {} else {
                                        getledger(location);
                                    }
                                }
                            }
                        });
                    }
                    $(".headericon-points").show();
                }
            }
        }
        getledger(0);
    }

    var mgrledger;

    function mgrinit() {
        if (!prizeinitq) {
            prizetableinit(".CEPointsPrizes", 0); //TODO: When we have a separate manager by location, it needs to go here.
            prizeinitq = true;
        }

        function getmgrledger() {
            //TODO: The ledger needs to work by location (based on the username).  I'm going to do that server-side for now (since we pass the user), but this needs to be a setting I think.
            //     Actually, this is so specific I'm not sure a setting would be worth it.  syanez => location 9, all others are all locations except 9.
            if ($.cookie("TP1Username") == "syanez") {
                pdx = 1;
            } else {
                pdx = 0;
            }
            a$.ajax({
                type: "GET",
                service: "JScript",
                async: true,
                data: {
                    lib: "pay",
                    cmd: "points.mgrledger"
                },
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: loaded
            });

            function loaded(json) {
                if (a$.jsonerror(json)) {} else {
                    mgrledger = json.ledger;
                    var inj = "<tr><td></td><td>Requested</td><td>Fulfilled</td><td>Name</td><td>Status</td><td>Project</td><td>Kronos</td><td>Supervisor</td><td>Temp?</td><td>Request</td><td>Points</td>"
                    if ($.cookie("TP1Username") == "syanez") {
                        inj += "<td>Q Value</td>";
                    } else {
                        inj += "<td>$ Value</td>";
                    }
                    inj += "<td>Total</td></tr>";
                    var bal = 0;
                    for (var i in mgrledger) {
                        inj += '<tr><td>';
                        if (typeof mgrledger[i].fulfdt == "object") {
                            inj += '<input type="button" value="Fulfill" class="RankPoints-Fulfill" /><span style="display:none;">' + i + '</span>';
                        }
                        inj += '</td>';
                        inj += '<td>' + mgrledger[i].date + '</td>';
                        inj += '<td>' + (typeof mgrledger[i].fulfdt == "object" ? "" : mgrledger[i].fulfdt) + '</td>';
                        inj += '<td>' + mgrledger[i].csrname + '(' + mgrledger[i].csr + ')&nbsp;<span class="CEPoints-message">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="display:none;">' + mgrledger[i].csr + "/" + mgrledger[i].csrname + '</span></span>' + '</td>';
                        inj += '<td>' + mgrledger[i].status + '</td>';
                        inj += '<td>' + mgrledger[i].project + '</td>';
                        inj += '<td>' + mgrledger[i].kronos + '</td>';
                        inj += '<td>' + mgrledger[i].supervisor + '</td>';
                        inj += '<td>' + mgrledger[i].temp + '</td>';
                        inj += '<td>' + mgrledger[i].redeemtype + '</td>';
                        inj += '<td>' + mgrledger[i].points + '</td>';
                        var dlr = 0;

                        //TODO: Redo this section to pull the value from rankpoints (needs a column) instead of getting it out of the current prize table.

                        for (var n in prizes[pdx].table) {
                            if (prizes[pdx].table[n].points <= mgrledger[i].points) {
                                if (a$.exists(prizes[pdx].table[n][mgrledger[i].redeemtype])) {
                                    dlr = prizes[pdx].table[n][mgrledger[i].redeemtype];
                                }
                            }
                        }

                        if (mgrledger[i].redeemtype == "GiftCert") {
                            if (mgrledger[i].points == 500) {
                                dlr = 225;
                            }
                        }

                        if (typeof dlr == "string") {
                            if ($.cookie("TP1Username") == "syanez") {
                                dlr = dlr.replace("Q ", "");
                            } else {
                                dlr = dlr.replace("$", "");
                            }
                        }

                        inj += '<td>' + numberWithCommas(dlr) + '</td>';
                        if (isNaN(dlr)) { //Added 7/12/2016 - Approximate the value of the prize based on the points.
                            if ($.cookie("TP1Username") == "syanez") {
                                if (mgrledger[i].points <= 500) {
                                    dlr = 900;
                                } else if (mgrledger[i].points <= 1000) {
                                    dlr = 2025;
                                } else {
                                    dlr = 3150; //TODO: This needs to run off the prize table.
                                }
                            } else {
                                if (mgrledger[i].points <= 500) {
                                    dlr = 200;
                                } else if (mgrledger[i].points <= 1000) {
                                    dlr = 400;
                                } else {
                                    dlr = 600; //TODO: This needs to run off the prize table.
                                }
                            }
                        }
                        bal += parseInt(dlr, 10);
                        if ($.cookie("TP1Username") == "syanez") {
                            inj += '<td>Q ' + numberWithCommas(bal) + '</td>';
                        } else {
                            inj += '<td>$' + numberWithCommas(bal) + '</td>';
                        }
                        inj += "</tr>";
                    }
                    $(".CEPointsMgrLedger table").html(inj);
                    $(".RankPoints-Fulfill").unbind().bind("click", function() {
                        var idx = parseInt($(this).parent().children().last().html(), 10);
                        if (confirm("NOTICE: As the " + stgRankPointsLabel + " Manager, it is your responsibility to carry out the fulfillment of this request.  Acuity will now guide you through notifying the CSR of your intent (using the messaging system), but the actual fulfillment is NOT MANAGED within the Acuity system.")) {
                            $("#messagediv").show();
                            $(".heading").html("Messaging");
                            $('#messagetab').show();
                            $('#messageslabel').trigger('click');
                            $(".messages-compose input").trigger("click");
                            var vk = "COMBO/selCSRs/" + mgrledger[idx].csr;
                            alert('Please compose a message for ' + mgrledger[i].csrname);
                            $('#composeto option[value="' + vk + '"]').attr("selected", "selected");
                            if ($("#composeto option:selected").val() != vk) {
                                $("#composeto").append($('<option></option>').val(mgrledger[idx].csr).html(mgrledger[idx].csrname).attr("selected", "selected"));
                            }
                            $("#composeto").trigger("liszt:updated");
                            $("#composesubject").val(stgRankPointsLabel + " Rewards");
                            var reward = "Gerbil";
                            for (var n in prizes[pdx].categories) {
                                if (prizes[pdx].categories[n].name == mgrledger[idx].redeemtype) {
                                    reward = prizes[pdx].categories[n].desc;
                                }
                            }
                            var buf = "Congratulations!  We are processing your " + stgRankPointsLabel + " redemption request!<br /><br />You have asked to exchange " + mgrledger[idx].points + " " + stgRankPointsLabel + " for ";
                            var dlr = 0;
                            for (var n in prizes[pdx].table) {
                                if (prizes[pdx].table[n].points <= mgrledger[idx].points) {
                                    dlr = prizes[pdx].table[n][mgrledger[idx].redeemtype];
                                }
                            }
                            if (mgrledger[idx].redeemtype == "Cash") {
                                buf += "" + numberWithCommas(dlr) + " in Cash.";
                            } else {
                                buf += "a " + reward + " valued at " + numberWithCommas(dlr)
                            }
                            buf += '<br />If this is incorrect or not your intention, please let me know immediately.<br /><br />All awards are subject to the <a target="_blank" href="../help.aspx?cid=CEPointsTC">' + stgRankPointsLabel + ' Terms &amp; Conditions</a><br /><br />Your reward will usually be delivered at the same time as your next payroll check.<br />If you have any questions, please feel free to message me (the ' + stgRankPointsLabel + ' Administrator).<br />Again, congratulations on your redemption, you\'ve earned it!';
                            $("#composebody").html(buf);
                            a$.ajax({
                                type: "GET",
                                service: "JScript",
                                async: false,
                                data: {
                                    lib: "pay",
                                    cmd: "points.fulfill",
                                    id: mgrledger[idx].id
                                },
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror,
                                success: loaded
                            });

                            function loaded(json) {
                                if (a$.jsonerror(json)) {} else {
                                    getmgrledger();
                                }
                            }

                        }
                    });
                    $(".CEPoints-message").unbind().bind("click", function() {
                        var spl = $(this).children().last().html().split("/");
                        var csr = spl[0];
                        var csrname = spl[1];
                        $("#messagediv").show();
                        $(".heading").html("Messaging");
                        $('#messagetab').show();
                        $('#messageslabel').trigger('click');
                        $(".messages-compose input").trigger("click");
                        var vk = "COMBO/selCSRs/" + csr;
                        $('#composeto option[value="' + vk + '"]').attr("selected", "selected");
                        if ($("#composeto option:selected").val() != vk) {
                            $("#composeto").append($('<option></option>').val(csr).html(csrname).attr("selected", "selected"));
                        }
                        $("#composeto").trigger("liszt:updated");

                    });
                }
            }
        }
        getmgrledger();
    }

    var prizes = [{ //Not Guatemala
            categories: [{
                    name: "Cash",
                    desc: "Cash"
                },
                {
                    name: "Prize",
                    desc: "Prize"
                }
            ],
            table: [{
                    points: 500,
                    Cash: "$200",
                    Prize: "Tablet ($225 Value)"
                },
                {
                    points: 1000,
                    Cash: "$450",
                    Prize: '50" LED Television ($500 Value)'
                },
                {
                    points: 1500,
                    Cash: "$700",
                    Prize: "Shopping Spree ($750)"
                },
                {
                    points: 2000,
                    Cash: "$950",
                    Prize: "Airline Gift Card ($1,000 Value)"
                },
                {
                    points: 2500,
                    Cash: "$1,200",
                    Prize: "Carnival Cruise Gift Card ($1,500 Value)<br />Expires October 31, 2016"
                },
                {
                    points: 3000,
                    Cash: "$1,475",
                    Prize: "Family of 4 Two day Disney Passes and $200 Gift Card ($1,500 Value)"
                },
                {
                    points: 3500,
                    Cash: "$1,750",
                    Prize: "No other option."
                },
                {
                    points: 4000,
                    Cash: "$2,050",
                    Prize: "Carnival Cruise Gift Card and Airline Gift Card ($2,500 Value)"
                },
                {
                    points: 4500,
                    Cash: "$2,350",
                    Prize: "No other option."
                },
                {
                    points: 6000,
                    Cash: "$3,300",
                    Prize: "7 Day Hawaiian Resort Stay and 1 round trip<br />airline ticket ($3,500 Value)<br/>Expires December 31, 2016"
                }
            ]
        },
        { //Guatemala
            categories: [{
                    name: "Cash",
                    desc: "Cash"
                },
                {
                    name: "Prize",
                    desc: "Prize"
                }
            ],
            table: [{
                    points: 500,
                    Cash: "Q 900.00",
                    Prize: "Wal-Mart Certificate (Q1,000.00 Value)"
                },
                {
                    points: 1000,
                    Cash: "Q 2,025.00",
                    Prize: 'Kawilal Hotel 2 days 1 night 2 adults (Q2,250.00 Value)'
                },
                {
                    points: 1500,
                    Cash: "Q 3,150.00",
                    Prize: "Refrigerator Frigidaire (Q3,300.00 Value)"
                },
                {
                    points: 2000,
                    Cash: "Q 4,275.00",
                    Prize: "Clothes Drier (Q4,500.00 Value)"
                },
                {
                    points: 2500,
                    Cash: "Q 5,400.00",
                    Prize: "50\" LED SMART TV (Q6,700.00 Value)"
                },
                {
                    points: 3000,
                    Cash: "Q 6637.50",
                    Prize: "Decameron Salinitas Trip 3 days 2 nights 4 adults (Q7,000.00 Value)"
                },
                {
                    points: 3500,
                    Cash: "Q 7,875.00",
                    Prize: "Tikal Trip 3 days 2 nights 2 adults (Q7,875.00 Value)"
                },
                {
                    points: 4000,
                    Cash: "Q 9,225.00",
                    Prize: "Roatan Trip 4 days 3 nights 2 adults (Q10,250.00 Value)"
                },
                {
                    points: 4500,
                    Cash: "Q 10,575.00",
                    Prize: "Motorcycle (Q10,575.00 Value)"
                },
                {
                    points: 6000,
                    Cash: "Q 14,850.00",
                    Prize: "Kitchen Supplies (Q15,750.00 Value)*"
                }
            ]
        }
    ];

    function prizetableinit(id, location) {
        pdx = 0;
        if (location == 9) pdx = 1;
        var buf = '<table><tr><td><span class="labPointsUpper">Points</span></td>';
        for (var i in prizes[pdx].categories) {
            buf += "<td>" + prizes[pdx].categories[i].desc + "</td>";
        }
        buf += "</tr>";
        for (var i in prizes[pdx].table) {
            buf += "<tr><td>" + numberWithCommas(prizes[pdx].table[i].points) + "</td>";
            for (var c in prizes[pdx].categories) {
                buf += "<td>" + prizes[pdx].table[i][prizes[pdx].categories[c].name] + "</td>";
            }
            buf += "</tr>";
        }
        buf += "</table>";
        $(id).html(buf);
    }

    function numberWithCommas(x) {
        return x;
        //return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // global variables
    window.appApmRankPoints = {
        //filter-related (could be split out at some point)
        csrinit: csrinit,
        supinit: supinit,
        mgrinit: mgrinit
    };

    function IsObject(obj) {
        return obj ? true : false;
    }
})();
